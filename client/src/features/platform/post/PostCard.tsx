import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ArrowUp, ArrowDown, Send, Trash2 } from "lucide-react";
import type { Doc } from "@/../convex/_generated/dataModel";
import { useUser } from "@/features/authentication/useUser";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface PostCardProps {
  post: Doc<"posts">;
  authorProfile: Doc<"profiles"> | null;
}

export function PostCard({ post, authorProfile }: PostCardProps) {
  const { profile } = useUser();
  const [isVoting, setIsVoting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  
  const votes = useQuery(api.posts.queries.getPostVotes, { postId: post._id });
  const comments = useQuery(api.posts.queries.getPostCommentsWithProfiles, { postId: post._id });
  const upvotePost = useMutation(api.posts.mutations.upvotePost);
  const downvotePost = useMutation(api.posts.mutations.downvotePost);
  const addComment = useMutation(api.posts.mutations.addComment);
  const deleteComment = useMutation(api.posts.mutations.deleteComment);

  const handleUpvote = async () => {
    if (!profile || isVoting) return;
    setIsVoting(true);
    try {
      await upvotePost({ postId: post._id });
    } catch (error) {
      console.error("Failed to upvote:", error);
      // You could add a toast notification here
    } finally {
      setIsVoting(false);
    }
  };

  const handleDownvote = async () => {
    if (!profile || isVoting) return;
    setIsVoting(true);
    try {
      await downvotePost({ postId: post._id });
    } catch (error) {
      console.error("Failed to downvote:", error);
      // You could add a toast notification here
    } finally {
      setIsVoting(false);
    }
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleSubmitComment = async () => {
    if (!profile || !newComment.trim() || isCommenting) return;
    setIsCommenting(true);
    try {
      await addComment({ postId: post._id, content: newComment.trim() });
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
      // You could add a toast notification here
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!profile || deletingCommentId) return;
    setDeletingCommentId(commentId);
    setConfirmingDeleteId(null);
    try {
      await deleteComment({ commentId });
    } catch (error) {
      console.error("Failed to delete comment:", error);
      // You could add a toast notification here
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleDeleteClick = (commentId: string) => {
    if (confirmingDeleteId === commentId) {
      handleDeleteComment(commentId);
    } else {
      setConfirmingDeleteId(commentId);
    }
  };

  const cancelDelete = () => {
    setConfirmingDeleteId(null);
  };

  const getVoteButtonStyle = (voteType: 1 | -1) => {
    if (!votes) return "text-muted-foreground hover:text-primary";
    
    const isVoted = votes.userVote === voteType;
    const isUpvoted = voteType === 1 && isVoted;
    const isDownvoted = voteType === -1 && isVoted;
    
    if (isUpvoted) return "text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30";
    if (isDownvoted) return "text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30";
    return "text-muted-foreground hover:text-primary hover:bg-muted/50";
  };

  const getVoteIconStyle = (voteType: 1 | -1) => {
    if (!votes) return "";
    
    const isVoted = votes.userVote === voteType;
    if (isVoted) return "fill-current";
    return "";
  };

  return (
    <Card className="mb-6 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={authorProfile?.avatar_url} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {authorProfile?.name?.charAt(0) || authorProfile?.username?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">{post.title}</CardTitle>
            <p className="text-sm text-muted-foreground truncate">
              by {authorProfile?.name || authorProfile?.username || "Unknown User"}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-foreground leading-relaxed">{post.content}</p>
        
        {/* Display image if available */}
        {post.imageUrl && (
          <div className="relative w-full">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto max-h-96 object-cover rounded-lg"
              onError={(e) => {
                // Hide image if it fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-md font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-4">
            {/* Upvote Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpvote}
              className={`flex items-center gap-2 ${getVoteButtonStyle(1)}`}
              disabled={!profile || isVoting}
            >
              <ArrowUp className={`h-4 w-4 ${getVoteIconStyle(1)} ${isVoting ? 'animate-pulse' : ''}`} />
              <span className="text-sm">{votes?.upvotes || 0}</span>
            </Button>
            
            {/* Downvote Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownvote}
              className={`flex items-center gap-2 ${getVoteButtonStyle(-1)}`}
              disabled={!profile || isVoting}
            >
              <ArrowDown className={`h-4 w-4 ${getVoteIconStyle(-1)} ${isVoting ? 'animate-pulse' : ''}`} />
              <span className="text-sm">{votes?.downvotes || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className={`flex items-center gap-2 transition-all duration-200 ${
                showComments 
                  ? 'text-primary bg-primary/10 border border-primary/20' 
                  : 'text-muted-foreground hover:text-primary hover:bg-muted/50'
              }`}
            >
              <MessageCircle className={`h-4 w-4 ${showComments ? 'fill-current' : ''}`} />
              <span className="text-sm">{comments?.length || 0}</span>
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
            {/* Add Comment */}
            {profile && (
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1"
                  disabled={isCommenting}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitComment();
                    }
                  }}
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isCommenting}
                  size="sm"
                  className="gap-2 min-w-[80px]"
                >
                  {isCommenting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Post
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-3">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.userProfile?.avatar_url} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {comment.userProfile?.name?.charAt(0) || comment.userProfile?.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {comment.userProfile?.name || comment.userProfile?.username || "Unknown User"}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-foreground">{comment.content}</p>
                        {profile?._id === comment.userId && (
                          <div className="flex items-center gap-1">
                            {confirmingDeleteId === comment._id ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteComment(comment._id)}
                                  disabled={deletingCommentId === comment._id}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  {deletingCommentId === comment._id ? (
                                    <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                                  ) : (
                                    "Delete"
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={cancelDelete}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(comment._id)}
                                disabled={deletingCommentId === comment._id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 