import PageLoader from "@/components/Loaders/PageLoader.tsx";
import MainPagesLayout from "@/components/MainPagesLayout.tsx";
import useGetDomainService from "@/services/getDomainService/useGetDomainService.ts";
import { DataTable } from "@repo/ui";
import { SectionLayout } from "@/components/Layouts/SectionLayout.tsx";
import {
  TopbarContainer,
  TopbarGroup,
} from "@/components/Layouts/TopbarLayout.tsx";
import { columns } from "./components/Columns.tsx";
import CreateDomainModal from "./components/CreateDomainModal.tsx";

const Domains = () => {
  const {
    services: { getDomainService },
  } = useGetDomainService();

  const domainsData = getDomainService?.data?.data || [];

  if (getDomainService?.isLoading) return <PageLoader />;

  return (
    <MainPagesLayout>
      <TopbarContainer title="Domains">
        <TopbarGroup>
          <CreateDomainModal />
        </TopbarGroup>
      </TopbarContainer>
      <SectionLayout>
        <div className="space-y-8">
          <div className="border border-border rounded-md">
            <DataTable columns={columns} data={domainsData} />
          </div>
        </div>
      </SectionLayout>
    </MainPagesLayout>
  );
};

export default Domains;
