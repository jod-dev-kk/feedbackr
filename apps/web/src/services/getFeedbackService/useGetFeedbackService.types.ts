interface IClientContext {
  os: string;
  browser: string;
  userAgent: string;
  language: string;
  screenWidth: string;
  screenHeight: string;
  url: string;
  networkStatus: string;
}
type ErrorType =
  | "TypeError"
  | "ReferenceError"
  | "Error"
  | "SyntaxError"
  | "AbortError"
  | "RangeError"
  | "UriError";

type StackFrame = {
  file: string | null;
  methodName: any;
  arguments: string[];
  lineNumber: number | null;
  column: number | null;
};
interface IDebugContext {
  errors: Record<
    string,
    [
      {
        type: ErrorType;
        message: string;
        stackTrace: StackFrame[];
        occuredAt: string;
        pageTimeMs: number;

        meta: { networkStatus: boolean };
      },
    ]
  >;
  network: [
    {
      url: string;
      method: string;
      payload: Record<string, any>;
      response: any;
      status: number | string;
      duration: string;
    },
  ];
}

interface IDomain {
  name: string;
  status: string;
}

type TFeedbackStatus = "PENDING" | "RESOLVED" | "REJECTED" | "INVALID" | "NIL";
type TPriorityStatus = "URGENT" | "LOW" | "MEDIUM" | "HIGH" | "NIL";

interface IFeedback {
  id: string;
  url: string;
  message: string;
  email: string;
  status: TFeedbackStatus;
  priority: TPriorityStatus;
  comment: string;
  createdAt: string;
  updatedAt: string;
  clientContext: IClientContext;
  debugContext: IDebugContext;
  domainId: string;
  images: any[];
  domain: IDomain;
}

interface IFeedbacksResponse {
  data: IFeedback[];
  message: string;
}

export type {
  IClientContext,
  IDebugContext,
  IDomain,
  IFeedback,
  IFeedbacksResponse,
  TFeedbackStatus,
  TPriorityStatus,
};
