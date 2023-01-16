function fetchJSONMiddleware(response: globalThis.Response) {
  return response.json().catch((error) => {
    console.error("Response may not support `json` conversion, so suppress the error");
    console.error(error);
    return {};
  });
}

export {fetchJSONMiddleware};
