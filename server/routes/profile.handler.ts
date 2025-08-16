import { Context } from 'hono';
import { updateProfile, updateProfileByUserId, getProfileById, getProfileByUserId, createProfile } from '../dal/profile.dal';
import { UpdateProfileSchema } from './profile.schema';
import { z } from 'zod';

export const handleUpdateProfile = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    
    // Validate the request body
    const validatedData = UpdateProfileSchema.parse(body);
    
    // Check if profile exists
    const existingProfile = await getProfileById(id);
    if (!existingProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    // Update the profile
    const updatedProfile = await updateProfile(id, validatedData);
    
    return c.json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    }, 200);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ 
        error: 'Validation error', 
        details: error.issues 
      }, 400);
    }
    
    console.error('Error updating profile:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

export const handleUpdateProfileByUserId = async (c: Context) => {
  try {
    const { userId } = c.req.param();
    const body = await c.req.json();
    
    // Validate the request body
    const validatedData = UpdateProfileSchema.parse(body);
    
    // Check if profile exists
    const existingProfile = await getProfileByUserId(userId);
    if (!existingProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    // Update the profile
    const updatedProfile = await updateProfileByUserId(userId, validatedData);
    
    return c.json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    }, 200);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ 
        error: 'Validation error', 
        details: error.issues 
      }, 400);
    }
    
    console.error('Error updating profile:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

export const handleCreateProfile = async (c: Context) => {
  try {
    const body = await c.req.json();
    
    // Validate required fields for creation
    const createProfileSchema = UpdateProfileSchema.extend({
      user_id: z.string().min(1),
      username: z.string().min(3),
      full_name: z.string().min(2),
      email: z.string().email(),
      user_type: z.enum(['creator', 'investor', 'mentor']),
      preferred_work_type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
      preferred_domain: z.enum(['creator', 'investor', 'mentor']),
      experience_level: z.enum(['junior', 'mid_level', 'senior', 'expert']),
    });
    
    const validatedData = createProfileSchema.parse(body);
    
    // Check if profile already exists for this user
    const existingProfile = await getProfileByUserId(validatedData.user_id);
    if (existingProfile) {
      return c.json({ error: 'Profile already exists for this user' }, 404);
    }
    
    // Create the profile
    const newProfile = await createProfile(validatedData);
    
    return c.json({
      message: 'Profile created successfully',
      profile: newProfile
    }, 201);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ 
        error: 'Validation error', 
        details: error.issues 
      }, 400);
    }
    
    console.error('Error creating profile:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

export const handleGetProfile = async (c: Context) => {
  try {
    const { id } = c.req.param();
    
    const profile = await getProfileById(id);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    return c.json({ profile }, 200);
    
  } catch (error) {
    console.error('Error getting profile:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};
