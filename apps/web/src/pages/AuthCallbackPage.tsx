import PageLoader from "@/components/Loaders/PageLoader.tsx";
import { useAuth } from "@/features/auth/hooks.ts";
import { useDomainRedirect } from "@/hooks/useDomainRedirect.ts";
import { Spinner } from "@repo/ui";
import { Navigate } from "react-router";

export const AuthCallbackPage = () => {
  const { userSession } = useAuth();
  const { isRedirecting } = useDomainRedirect();

  if (userSession.isPending || isRedirecting) {
    return <PageLoader />;
  }

  if (!userSession.data?.session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-3 px-3 lg:px-0">
      <Spinner variant="primary" size="xs" />
      <p>Setting up your workspace ...</p>
    </div>
  );
};
