import React, { useState } from 'react';
import { useProfile, useCurrentProfile, useProfiles } from './useProfile';
import useUser from './useUser';

export default function ProfileExample() {
  const [profileId, setProfileId] = useState('');
  const [searchIds, setSearchIds] = useState('');
  
  // Get current user and their profile
  const { user, profile, isLoading: userLoading } = useUser();
  
  // Fetch a specific profile by ID
  const { data: specificProfile, isLoading: specificLoading } = useProfile(profileId);
  
  // Fetch multiple profiles
  const ids = searchIds.split(',').map(id => id.trim()).filter(Boolean);
  const { data: multipleProfiles, isLoading: multipleLoading } = useProfiles(ids);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Profile Examples with Hono RPC</h1>
      
      {/* Current User Profile */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Current User Profile</h2>
        {userLoading ? (
          <div>Loading current user...</div>
        ) : user ? (
          <div>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {profile && (
              <div className="mt-2 p-2 bg-gray-100 rounded">
                <p><strong>Full Profile from Hono RPC:</strong></p>
                <p>Name: {profile.name}</p>
                <p>Email Verified: {profile.emailVerified ? 'Yes' : 'No'}</p>
                <p>Created: {new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        ) : (
          <div>Not authenticated</div>
        )}
      </div>

      {/* Fetch Profile by ID */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Fetch Profile by ID</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Enter profile ID"
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          />
        </div>
        
        {specificLoading ? (
          <div>Loading profile...</div>
        ) : specificProfile ? (
          <div className="p-2 bg-blue-100 rounded">
            <p><strong>Profile:</strong></p>
            <p>ID: {specificProfile.id}</p>
            <p>Name: {specificProfile.name}</p>
            <p>Email: {specificProfile.email}</p>
            <p>Created: {new Date(specificProfile.createdAt).toLocaleDateString()}</p>
          </div>
        ) : profileId && (
          <div className="text-gray-600">No profile found with that ID</div>
        )}
      </div>

      {/* Fetch Multiple Profiles */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Fetch Multiple Profiles</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Enter profile IDs separated by commas"
            value={searchIds}
            onChange={(e) => setSearchIds(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          />
        </div>
        
        {multipleLoading ? (
          <div>Loading profiles...</div>
        ) : multipleProfiles && multipleProfiles.length > 0 ? (
          <div className="space-y-2">
            <p><strong>Found {multipleProfiles.length} profiles:</strong></p>
            {multipleProfiles.map(profile => (
              <div key={profile.id} className="p-2 bg-green-100 rounded">
                <p><strong>{profile.name}</strong> ({profile.email})</p>
                <p className="text-sm text-gray-600">ID: {profile.id}</p>
              </div>
            ))}
          </div>
        ) : searchIds && (
          <div className="text-gray-600">No profiles found</div>
        )}
      </div>

      {/* API Endpoints Info */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h2 className="text-xl font-semibold mb-3">Available Hono RPC Endpoints</h2>
        <div className="space-y-2 text-sm">
          <p><code>GET /api/profiles/me</code> - Get current user's profile</p>
          <p><code>GET /api/profiles/:id</code> - Get profile by ID</p>
          <p><code>PUT /api/profiles/:id</code> - Update profile</p>
        </div>
      </div>
    </div>
  );
}
