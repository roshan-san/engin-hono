import { authClient } from '../lib/auth-client'
import { Button } from './ui/button';
import { FcGoogle } from 'react-icons/fc';

export default function GoogleLogin() {
  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
      })
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
