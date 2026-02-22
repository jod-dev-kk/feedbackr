import { IIndividualFeedbackResponse } from "@/services/getIndividualFeedbackService/useGetIndividualFeedbackService.types.ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { Globe, Terminal } from "lucide-react";
import {
  CodeSnippet,
  DebugContent,
  DebugDescription,
  DebugLeftSide,
  DebugRightSide,
  DebugTitle,
} from "./DebugContent.tsx";

const TYPE_MAPPER: Record<string, { name: string; description: string }> = {
  type_error: {
    name: "Type Errors",
    description: "These are caused by invalid value types passed",
  },
  reference_error: {
    name: "Reference Errors",
    description: "These are reference errors ",
  },
  promise: {
    name: "Promise Errors",
    description: "There are promise failed errors",
  },
};

const NETWORK_FIELD_MAPPER: Record<
  string,
  { name: string; description: string }
> = {
  url: {
    name: "Request URL",
    description: "The full URL the request was sent to.",
  },
  method: {
    name: "HTTP Method",
    description: "The HTTP verb used for this request (GET, POST, etc.).",
  },
  status: {
    name: "Status Code",
    description: "The HTTP response status code returned by the server.",
  },
  statusText: {
    name: "Status Text",
    description: "The human-readable status text from the response.",
  },
  requestHeaders: {
    name: "Request Headers",
    description: "All HTTP headers that were sent along with the request.",
  },
  responseHeaders: {
    name: "Response Headers",
    description: "All HTTP headers returned from the server.",
  },
  payload: {
    name: "Request Payload",
    description: "The body sent with the request (e.g., JSON payload).",
  },
  responseBody: {
    name: "Response Body",
    description: "The body returned by the server for this request.",
  },
  duration: {
    name: "Duration",
    description: "How long the request took from start to finish (ms).",
  },
  error: {
    name: "Error",
    description: "Any error captured for this network request.",
  },
};

export const DebugSection = ({
  data,
}: {
  data: IIndividualFeedbackResponse;
}) => {
  const debugContext = data?.data?.debugContext ?? null;

  return (
    <>
      <div className="relative flex-1 w-full rounded-xl bg-muted bg-[#0b0b0b]_ border border-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] overflow-hidden">
        <div className="">
          <div className="p-6">
            <h2 className="font-semibold ">Debug Diagnostics</h2>
            <span className="text-sm text-neutral-500">
              Technical context and runtime diagnostics captured at the time of
              feedback
            </span>
          </div>
          <Tabs defaultValue="console" className="px-5">
            <TabsList variant="line">
              <TabsTrigger
                value="console"
                className="text-neutral-600! after:bg-neutral-500! font-normal tracking-tight after:h-[2.5px]!"
              >
                <Terminal size={16} />
                Console
              </TabsTrigger>
              <TabsTrigger
                value="network"
                className="text-neutral-600! after:bg-neutral-500! font-normal tracking-tight after:h-[2.5px]!"
              >
                <Globe />
                Network
              </TabsTrigger>
            </TabsList>
            <div className="border border-border rounded-lg mt-2 mb-6">
              <TabsContent value="console">
                {debugContext && debugContext?.errors?.length > 0 ? (
                  debugContext?.errors?.map((error, idx) => {
                    return (
                      <DebugContent key={idx} className="">
                        <DebugLeftSide>
                          <DebugTitle>
                            {TYPE_MAPPER[error.type]?.name ?? "Unknown Error"}
                          </DebugTitle>
                          <DebugDescription>
                            {TYPE_MAPPER[error.type]?.description ??
                              "An error occurred but its type is not mapped."}
                          </DebugDescription>
                        </DebugLeftSide>
                        <DebugRightSide className="min-w-0">
                          <CodeSnippet variant="dark" theme={"slack-dark"}>
                            {error.error}
                          </CodeSnippet>
                        </DebugRightSide>
                      </DebugContent>
                    );
                  })
                ) : (
                  <DebugContent>
                    <DebugLeftSide>
                      <DebugTitle>No Errors</DebugTitle>
                      <DebugDescription>
                        We could not capture any client side errors.
                      </DebugDescription>
                    </DebugLeftSide>
                    <DebugRightSide className="w-full min-w-0">
                      <CodeSnippet variant="dark" theme="slack-dark">
                        {"// No errors recorded"}
                      </CodeSnippet>
                    </DebugRightSide>
                  </DebugContent>
                )}
              </TabsContent>
              <TabsContent value="network">
                {debugContext && debugContext?.network?.length > 0 ? (
                  debugContext?.network?.map((networkUnit, idx) =>
                    Object.entries(networkUnit).map(([key, value]) => (
                      <DebugContent key={idx}>
                        <DebugLeftSide>
                          <DebugTitle>
                            {NETWORK_FIELD_MAPPER[key]?.name}
                          </DebugTitle>
                          <DebugDescription>
                            {NETWORK_FIELD_MAPPER[key]?.description}
                          </DebugDescription>
                        </DebugLeftSide>

                        <DebugRightSide className="w-full min-w-0">
                          <CodeSnippet variant="dark" theme="slack-dark">
                            {typeof value === "string"
                              ? value
                              : JSON.stringify(value, null, 2)}
                          </CodeSnippet>
                        </DebugRightSide>
                      </DebugContent>
                    )),
                  )
                ) : (
                  <DebugContent>
                    <DebugLeftSide>
                      <DebugTitle>No network calls</DebugTitle>
                      <DebugDescription>
                        We could not capture any network activity for this
                        session.
                      </DebugDescription>
                    </DebugLeftSide>
                    <DebugRightSide className="w-full min-w-0">
                      <CodeSnippet variant="dark" theme="slack-dark">
                        {"// No requests recorded"}
                      </CodeSnippet>
                    </DebugRightSide>
                  </DebugContent>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
};
