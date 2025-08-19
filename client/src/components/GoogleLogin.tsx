import { authClient } from '../lib/auth-client'
import { Button } from './ui/button';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from '@tanstack/react-router';

export default function GoogleLogin() {
  const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social(
        { 
          provider: "google",
          
        },
        {
          onSuccess: () => {
            navigate({ to: "/" });
          },  
         
        }
      );
    } catch (error) {
      console.error('Google login failed:', error)
    }
  }

  return (
    <Button
    className="bg-white border text-black rounded-full"
    onClick={handleGoogleLogin}
  >
    <FcGoogle className="h-5 w-5" />
    <span className="text-base">Sign in with Google</span>
  </Button>
  )
}
