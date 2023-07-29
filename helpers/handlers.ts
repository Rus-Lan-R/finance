export const Handlers = {
  defaultErrorHandler: (errorText: string): void => {
    console.log("errorText", errorText);
  },
  defaultErrorAPIHandler: (errorText: string, status: string): void => {
    console.log("errorText", errorText);
    console.log("status", status);
  }
};
