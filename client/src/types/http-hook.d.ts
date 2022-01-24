import { AxiosResponse } from "axios";

export type AxiosInstanceTypes = "internalInstance" | "externalInstance";

// Http Hook Reducer
export type HttpState = {
  loading: boolean;
  error?: string;
  data?: any;
};

export type HttpActionType = "CLEAR" | "ERROR" | "RESPONSE" | "SEND";

export type HttpAction = {
  type: HttpActionType;
  errorMessage?: string;
  responseData?: unknown;
};

// Http options
export type HttpMethods = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type HttpHeaders = {
  "Content-Type"?: "application/json";
  Authorization?: string;
};

export type HttpRequestParams = {
  url: string;
  method: HttpMethods;
  body?: unknown;
  headers?: HttpHeaders;
};

// Http Hook Functions
export type ClearHttpState = () => void;

export type ExecuteRequest = <M>(
  { url, method, body, headers }: HttpRequestParams,
  axiosInstance: AxiosInstanceTypes
) => Promise<AxiosResponse<M>>;

export type SendRequest = <M>(
  requestParameters: HttpRequestParams,
  external?: boolean
) => Promise<AxiosResponse<M>>;

// Http Hook
export type UseHttp = <M>(
  initialRequest?: HttpRequestParams
) => {
  isLoading: boolean;
  httpData: M;
  httpError?: string;
  sendRequest: SendRequest;
  clearHttpState: ClearHttpState;
};
