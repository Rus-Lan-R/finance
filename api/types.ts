export type ResponseSuccessHandler = (data: any) => void;

export type ResponseErrorHandler = (message: string) => void;

export type Method =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH"
  | "link"
  | "LINK"
  | "unlink"
  | "UNLINK";

export type ApiParams = {
  data?: any;
  method: Method;
  section?: "private" | "public";
  url: string;
  contentType?: string;
  baseURL?: string;
  params?: object;
};
