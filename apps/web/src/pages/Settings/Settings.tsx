import { toast } from "sonner";
import MainPagesLayout from "@/components/MainPagesLayout.tsx";
import { SectionLayout } from "@/components/Layouts/SectionLayout.tsx";
import {
  TopbarContainer,
  TopbarGroup,
} from "@/components/Layouts/TopbarLayout.tsx";
import { Separator } from "@repo/ui";
import { useSettings } from "@/hooks/useSettings.ts";
import { AccountSection } from "./components/AccountSection.tsx";
import { DomainsSection } from "./components/DomainsSection.tsx";
import { NotificationsSection } from "./components/NotificationsSection.tsx";
import { DeleteAccountSection } from "./components/DeleteAccountSection.tsx";

const Settings = () => {
  const {
    data: { domains, selectedDomain, user },
    functions: { handleDomainStatusChange },
  } = useSettings();

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    try {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (error) {
      toast.error("Clipboard access denied");
    }
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion feature not implemented yet");
  };

  return (
    <MainPagesLayout>
      <TopbarContainer title="Settings">
        <TopbarGroup>
          <></>
        </TopbarGroup>
      </TopbarContainer>

      <SectionLayout>
        <div className="mx-auto max-w-3xl space-y-10 pt-4 pb-20">
          <AccountSection user={user} />

          <Separator />

          <DomainsSection
            domains={domains}
            selectedDomain={selectedDomain}
            onStatusChange={handleDomainStatusChange}
            copyToClipboard={copyToClipboard}
          />

          <Separator />
          <NotificationsSection />
          <Separator />
          <DeleteAccountSection onDelete={handleDeleteAccount} />
        </div>
      </SectionLayout>
    </MainPagesLayout>
  );
};

export default Settings;
