import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Hash, Image, X, Upload, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/create-post')({
  component: CreatePostPage,
});

function CreatePostPage() {
  const navigate = useNavigate();
  const createPost = useMutation(api.posts.mutations.createPost);
  const generateUploadUrl = useMutation(api.posts.mutations.generateUploadUrl);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      await createPost({
        title,
        content,
        tags: tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
        imageUrl: imageUrl || undefined,
      });
      
      // Clear form
      setTitle('');
      setContent('');
      setTags('');
      setImageUrl('');
      setImagePreviewUrl('');
      
      // Navigate back to home using TanStack Router
      navigate({ to: '/home' });
    } catch (error) {
      console.error('Error creating post:', error);
      // Handle error if needed
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImageUrl('');
    setImagePreviewUrl('');
    setUploadError('');
  };

  const handleFileUpload = async (file: File) => {
    setUploadError('');
    setUploading(true);
    
    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      setUploading(false);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      setUploading(false);
      return;
    }

    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error('Upload failed');
      }

      const { storageId } = await result.json();
      
      // Store the storage ID as the image URL (Convex will handle the URL generation)
      setImageUrl(storageId);
      setImagePreviewUrl(URL.createObjectURL(file));
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              to="/home" 
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted/80 hover:bg-muted transition-all duration-200 hover:scale-105 shadow-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                Create Post
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-1">
                Share your thoughts with the community
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                What's happening?
              </CardTitle>
              <CardDescription>
                Give your post a catchy title
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter your post title..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                disabled={loading}
                className="text-lg font-medium h-12"
              />
            </CardContent>
          </Card>
          
          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Share your thoughts
              </CardTitle>
              <CardDescription>
                Write about what's on your mind
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Share your thoughts..."
                value={content}
                onChange={e => setContent(e.target.value)}
                disabled={loading}
                className="min-h-[200px] text-base resize-none"
              />
            </CardContent>
          </Card>
          
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Add Image (Optional)
              </CardTitle>
              <CardDescription>
                Upload an image to make your post more engaging
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload */}
              <div
                className={`border border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <Loader2 className="w-8 h-8 mx-auto mb-3 text-muted-foreground animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                )}
                <p className="text-base text-muted-foreground mb-2">
                  {uploading ? 'Uploading...' : 'Drag & drop or click to upload'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Max 5MB • JPG, PNG, GIF, WebP
                </p>
              </div>
              
              {uploadError && (
                <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <span className="text-sm text-destructive">{uploadError}</span>
                </div>
              )}
              
              {/* Image Preview */}
              {imagePreviewUrl && (
                <div className="relative rounded-lg overflow-hidden border">
                  <img 
                    src={imagePreviewUrl} 
                    alt="Preview" 
                    className="w-full max-h-64 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={clearImage}
                    className="absolute top-3 right-3 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" />
                Add Tags (Optional)
              </CardTitle>
              <CardDescription>
                Add relevant tags to help others discover your post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Add tags (comma separated) - e.g., startup, tech, innovation"
                value={tags}
                onChange={e => setTags(e.target.value)}
                disabled={loading}
                className="h-12"
              />
            </CardContent>
          </Card>
          
          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-border/50">
            <Link to="/home">
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </Link>
            <Button 
              onClick={handleCreatePost} 
              disabled={loading || !title || !content}
              className="px-8 h-12 text-base font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Create Post
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 