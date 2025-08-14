import { authClient } from '../lib/auth-client'
import { FaGoogle } from "react-icons/fa";

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
    <button
      onClick={handleGoogleLogin}
      className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center"
    >
      <FaGoogle className="w-5 h-5 mr-3" />
      <span>Continue with Google</span>
    </button>
  )
}
