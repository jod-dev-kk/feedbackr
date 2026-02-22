// hooks/useDomainRedirect.ts
import { useAuth } from "@/features/auth/hooks.ts";
import useGetDomainExistService from "@/services/getDomainExistService/useGetDomainExistService.ts";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useCallback, useEffect } from "react";

interface UseDomainRedirectProps {
  onNoDomains?: () => void; // Custom handler for no domains
}

export const useDomainRedirect = ({
  onNoDomains,
}: UseDomainRedirectProps = {}) => {
  const { userSession } = useAuth();
  const navigate = useNavigate();
  const {
    data: { domains, hasDomains },
    services: { getDomainExistService },
  } = useGetDomainExistService();

  const handleRedirect = useCallback(() => {
    // 401 → login
    if (getDomainExistService.error?.response?.status === 401) {
      toast.error(
        getDomainExistService.error.response.data?.message || "Session expired",
      );
      navigate("/login", { replace: true });
      return;
    }

    // Still processing
    if (
      getDomainExistService.isLoading ||
      getDomainExistService.isPending ||
      getDomainExistService.error
    ) {
      return;
    }

    // Has domains → dashboard
    if (hasDomains && domains?.[0]?.id) {
      toast.info(`Redirecting to ${domains[0].name}`);
      navigate(`/dashboard/${domains[0].id}`, { replace: true });
      return;
    }

    // No domains → custom handler or default
    if (onNoDomains) {
      onNoDomains();
    } else {
      navigate("/onboarding/create-domain", { replace: true });
    }
  }, [
    getDomainExistService.error,
    getDomainExistService.isLoading,
    getDomainExistService.isPending,
    hasDomains,
    domains,
    navigate,
    onNoDomains,
  ]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  return {
    isRedirecting:
      getDomainExistService.isLoading || getDomainExistService.isPending,
    hasError: !!getDomainExistService.error,
    domains,
  };
};
