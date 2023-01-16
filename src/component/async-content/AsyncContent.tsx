export type AsyncContentStatus = "error" | "pending" | "success";
export type AsyncContentError = undefined | AsyncProcessState["error"];

interface AsyncContentProps {
  requestStates: AsyncProcessState[];
  content: (status: AsyncContentStatus, error?: AsyncContentError) => JSX.Element;
}

function AsyncContent({requestStates, content}: AsyncContentProps) {
  const isAllFetched = requestStates.every((request) => request.isRequestFetched);
  const requestError = requestStates.find((request) => request.error);
  let node = content("pending");

  if (requestError) {
    node = content("error", requestError.error);
  } else if (isAllFetched) {
    node = content("success");
  }

  return node;
}

export default AsyncContent;
