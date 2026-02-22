import { SectionLayout } from "@/components/Layouts/SectionLayout.tsx";
import {
  TopbarContainer,
  TopbarGroup,
} from "@/components/Layouts/TopbarLayout.tsx";
import MainPagesLayout from "@/components/MainPagesLayout.tsx";
import { cn } from "@/lib/utils.ts";
import useGetIndividualFeedbackService from "@/services/getIndividualFeedbackService/useGetIndividualFeedbackService.ts";
import { Image } from "lucide-react";
import { useParams } from "react-router";
import { CommentSection } from "./components/CommentSection.tsx";
import { FeedbackDeleteSection } from "./components/FeedbackDeleteSection.tsx";
import { PriorityFilter } from "./components/PriorityFilter.tsx";
import { StatusFilter } from "./components/StatusFilter.tsx";
import { DebugSection } from "./components/diagnostic/DebugSection.tsx";
import { Skeleton } from "@repo/ui";

export const IndividualFeedbackPage = () => {
  const { domainId, feedbackId } = useParams<{
    domainId: string;
    feedbackId: string;
  }>();
  const {
    services: { getIndividualFeedbackService },
  } = useGetIndividualFeedbackService({
    domainId: domainId ?? "",
    feedbackId: feedbackId ?? "",
  });

  return (
    <>
      <MainPagesLayout>
        <TopbarContainer title="Feedback">
          <TopbarGroup>
            <StatusFilter />
            <PriorityFilter />
            <FeedbackDeleteSection />
          </TopbarGroup>
        </TopbarContainer>
        <SectionLayout>
          <div className="flex flex-col gap-y-6 pt-4">
            <div className="w-full space-y-6 ">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold leading-snug tracking-tight">
                  {getIndividualFeedbackService?.data?.data?.message}
                </h1>
                <Section
                  context={getIndividualFeedbackService?.data?.data?.status}
                  variant={
                    getIndividualFeedbackService?.data?.data?.status?.toLowerCase() as never
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch min-h-[420px] pt-4">
                <div className="h-full flex flex-col">
                  <Section
                    section="Screenshot"
                    className="flex pb-2"
                    variant="info"
                  />
                  <div className="relative flex-1 rounded-xl bg-muted/30 overflow-hidden">
                    {getIndividualFeedbackService?.data?.data?.images &&
                    getIndividualFeedbackService?.data?.data?.images?.length >
                      0 ? (
                      <>
                        <img
                          src={
                            getIndividualFeedbackService?.data?.data?.images[0]
                          }
                          // src="https://images.unsplash.com/photo-1761839256547-0a1cd11b6dfb?q=80&w=1169&auto=format&fit=crop"
                          alt="Feedback Screenshot"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </>
                    ) : (
                      <div className="flex flex-col  items-center justify-center gap-2 min-h-[420px] select-none">
                        <Image className="text-neutral-500" />
                        <span className="text-xs text-neutral-500">
                          No Feedback Image found
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* <Section
                    context="2 Errors"
                    section="Debug Data"
                    className="flex md:hidden"
                    variant="alert"
                  /> */}
                <div className="flex flex-col gap-y-6 w-full">
                  {/* ENVIRONMENT */}
                  <div className="space-y-3 w-full">
                    <Section
                      section="Environment"
                      // className="hidden md:flex"
                      variant="info"
                    />

                    <div className="w-full">
                      <div className="rounded-xl border border-border bg-card p-4 space-y-3 w-full">
                        <EnvRow
                          label="Browser"
                          value={
                            getIndividualFeedbackService?.data?.data
                              ?.clientContext.browser ?? "N/A"
                          }
                        />
                        <EnvRow
                          label="Operating System"
                          value={
                            getIndividualFeedbackService?.data?.data
                              ?.clientContext.os ?? "N/A"
                          }
                        />
                        {/* <EnvRow label="Viewport" value="1920x1080" /> */}
                      </div>
                    </div>
                  </div>

                  {/* PAGE CONTEXT */}
                  <div className="space-y-3 w-full">
                    <Section
                      section="Page Context"
                      // className="hidden md:flex"
                      variant="info"
                    />

                    <div className="rounded-xl border border-border bg-card p-4 space-y-2 w-full">
                      <a
                        href={getIndividualFeedbackService?.data?.data?.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-500 hover:underline break-all"
                      >
                        {getIndividualFeedbackService?.data?.data?.url ?? "N/A"}
                      </a>

                      {/* <p className="text-xs text-muted-foreground">1.2.3</p> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-full flex flex-col space-y-3">
              <Section
                context="2 Errors"
                section="Debug Data"
                className=""
                variant="alert"
              />
              {getIndividualFeedbackService.data &&
              Object.keys(getIndividualFeedbackService.data?.data?.debugContext)
                .length > 0 ? (
                <DebugSection data={getIndividualFeedbackService.data} />
              ) : (
                <Skeleton className="bg-muted h-[50px] w-full rounded-lg" />
              )}
            </div>
          </div>
        </SectionLayout>

        {/* Comments */}
        <div className="p-6 space-y-3">
          <h1 className="font-medium tracking-tight text-xl pl-1">Activity</h1>
          <CommentSection />
        </div>
      </MainPagesLayout>
    </>
  );
};

function EnvRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm w-full">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

function Section({
  context,
  section,
  className,
  variant = "info",
}: {
  className?: string;
  section?: string;
  context?: string;
  variant?: "info" | "warn" | "alert";
}) {
  const variantStyles = {
    info: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    warn: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    alert: "bg-red-500/10 text-red-500 border-red-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    nil: "bg-neutral-500/10 text-neutral-500 border-neutral-500/20",
    resolved: "bg-green-500/10 text-green-500 border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    invalid: "bg-red-500/10 text-red-500 border-red-500/20",
    not_resolved: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    notresolved: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  };

  return (
    <div className={cn("flex items-center gap-x-2", className)}>
      <p className="text-xs tracking-widest text-muted-foreground uppercase">
        {section}
      </p>

      {context && (
        <span
          className={cn(
            "text-[10px] font-semibold px-2 py-0.5 leading-4 rounded-full border",
            variantStyles[variant],
          )}
        >
          {context}
        </span>
      )}
    </div>
  );
}
