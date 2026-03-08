import { SectionLayout } from "@/components/Layouts/SectionLayout.tsx";
import {
  TopbarContainer,
  TopbarGroup,
} from "@/components/Layouts/TopbarLayout.tsx";
import PageLoader from "@/components/Loaders/PageLoader.tsx";
import MainPagesLayout from "@/components/MainPagesLayout.tsx";
import useGetFeedbacks from "@/hooks/useGetFeedbacks.ts";
import useGetDomainService from "@/services/getDomainService/useGetDomainService.ts";
import { CheckCircle2, CircleDashed, Clock, Inbox } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { BrowserStats } from "./components/BrowserStatsCard.tsx";
import { MetricCard } from "./components/MetricCard.tsx";
import { MostFeedbackPagesCard } from "./components/MostFeedbackPagesCard.tsx";
import { RecentFeedbacks } from "./components/RecentFeedbacks.tsx";

export default function Dashboard() {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const {
    services: { getDomainService },
  } = useGetDomainService();

  const {
    services: { getFeedbackService },
    data: { feedbackMetricData },
  } = useGetFeedbacks();

  useEffect(() => {
    if (!domainId || getDomainService.isLoading) return;
    if (
      !getDomainService?.data?.data?.some((domain) => domain?.id === domainId)
    ) {
      const newDomainId = getDomainService?.data?.data?.[0]?.id?.toString();
      if (newDomainId) {
        navigate(`/dashboard/${newDomainId}`);
      }
    }
  }, [
    domainId,
    getDomainService?.isLoading,
    domainId,
    getDomainService?.isLoading,
    getDomainService?.data?.data,
    navigate,
  ]);

  if (getDomainService?.isLoading || getFeedbackService?.isLoading)
    return <PageLoader title="" />;

  return (
    <MainPagesLayout>
      <TopbarContainer title="Dashboard">
        <TopbarGroup>
          <></>
        </TopbarGroup>
      </TopbarContainer>

      <SectionLayout>
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Feedback"
              value={feedbackMetricData?.TOTAL}
              icon={Inbox}
            />

            <MetricCard
              title="Pending"
              value={feedbackMetricData?.PENDING}
              icon={Clock}
              iconClassName="text-amber-600 bg-amber-50"
            />

            <MetricCard
              title="Invalid"
              value={feedbackMetricData?.INVALID}
              icon={CircleDashed}
              iconClassName="text-blue-600 bg-blue-50"
            />

            <MetricCard
              title="Resolved"
              value={feedbackMetricData?.RESOLVED}
              icon={CheckCircle2}
              iconClassName="text-emerald-600 bg-emerald-50"
            />
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <MostFeedbackPagesCard />
            <BrowserStats />
          </div>

          <RecentFeedbacks />
        </div>
      </SectionLayout>
    </MainPagesLayout>
  );
}
//  px-6 py-4
