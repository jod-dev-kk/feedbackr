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
  TypeError: {
    name: "Type Errors",
    description:
      "Occurs when a value is not of the expected type, such as calling a non-function, accessing properties on undefined/null, or passing invalid argument types.",
  },

  ReferenceError: {
    name: "Reference Errors",
    description:
      "Triggered when code attempts to access a variable or identifier that has not been declared or is out of scope.",
  },

  GeneralErrors: {
    name: "General Errors",
    description:
      "Represents custom or generic errors thrown intentionally in application logic using the standard Error constructor.",
  },

  promise: {
    name: "Promise Errors",
    description:
      "Occurs when a Promise is rejected or an asynchronous operation fails without proper error handling.",
  },

  AbortError: {
    name: "Abort Controller Errors",
    description:
      "Thrown when an asynchronous operation such as a fetch request is intentionally cancelled using an AbortController.",
  },

  RangeError: {
    name: "Range Errors",
    description:
      "Occurs when a value is outside the allowed range, such as passing invalid lengths to arrays or using numbers outside permitted limits.",
  },

  URIError: {
    name: "URI Errors",
    description:
      "Thrown when invalid URI encoding or decoding is attempted, typically from malformed input to encodeURI or decodeURI functions.",
  },

  SyntaxError: {
    name: "Syntax Errors",
    description:
      "Occurs when JavaScript encounters invalid code syntax during parsing, such as malformed JSON or incorrect language structure.",
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
                {debugContext && Object.keys(debugContext.errors).length > 0 ? (
                  Object.entries(debugContext.errors).map(
                    ([bucket, errors]) => {
                      const firstError = errors[0];

                      return (
                        <DebugContent key={bucket}>
                          <DebugLeftSide>
                            <DebugTitle>
                              {TYPE_MAPPER[firstError?.type]?.name ??
                                "Unknown Error"}{" "}
                              ({errors.length})
                            </DebugTitle>

                            <DebugDescription>
                              {TYPE_MAPPER[firstError?.type]?.description ??
                                "An error occurred but its type is not mapped."}
                            </DebugDescription>
                          </DebugLeftSide>

                          <DebugRightSide className="min-w-0">
                            {errors.map((error, idx) => (
                              <div key={idx} className="mb-4">
                                <CodeSnippet variant="dark" theme="slack-dark">
                                  {error.message}
                                </CodeSnippet>

                                <CodeSnippet variant="dark" theme="slack-dark">
                                  {error.stackTrace
                                    ?.map(
                                      (trace) =>
                                        `${trace.file}:${trace.lineNumber}:${trace.column}`,
                                    )
                                    .join("\n")}
                                </CodeSnippet>
                              </div>
                            ))}
                          </DebugRightSide>
                        </DebugContent>
                      );
                    },
                  )
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
                      <DebugTitle>Network Monitoring — Coming Soon</DebugTitle>
                      <DebugDescription>
                        We're working on capturing network activity for this
                        session. Soon you'll be able to inspect API requests,
                        responses, and timings here.
                      </DebugDescription>
                    </DebugLeftSide>

                    <DebugRightSide className="w-full min-w-0">
                      <CodeSnippet variant="dark" theme="slack-dark">
                        {`// Network activity panel
// Feature in v2

// Soon you'll see:
// • API requests
// • Response status codes
// • Request/response payloads
// • Timing and performance metrics

// Stay tuned 🚀`}
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
