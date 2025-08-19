import { createFileRoute } from '@tanstack/react-router'
import LandingPage from '@/features/landing/LandingPage';
import useUser from '@/features/authentication/useUser';
import SignOut from '@/components/SignOut';

export const Route = createFileRoute('/')({
  component: App,
})


export default function App() {
  const { user, isLoading } = useUser();
  if (user && user.data?.user) {
    return (
      <div>
        <h1>Hello {user.data.user.email}</h1>
        <SignOut />
      </div>
    )
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  else return (
    <LandingPage />
  );
}


