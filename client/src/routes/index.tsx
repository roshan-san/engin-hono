import { createFileRoute, Navigate } from '@tanstack/react-router'
import LandingPage from '@/features/landing/LandingPage';
import useUser from '@/features/authentication/useUser';

export const Route = createFileRoute('/')({
  component: App,
})


export default function App() {
  const { user, isLoading } = useUser();
  if (user) {
    return <Navigate to="/onboard/user-type" />;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <LandingPage />
  );
}


