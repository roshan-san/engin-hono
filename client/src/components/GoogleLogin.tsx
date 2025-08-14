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
      className="btn btn-outline btn-primary w-full"
    >
      <FaGoogle className="w-5 h-5 mr-3" />
      <span>Continue with Google</span>
    </button>
  )
}
