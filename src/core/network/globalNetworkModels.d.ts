interface ListRequestResponse<Result> {
  next: null | string;
  previous: null | string;
  results: Result[];
}

// TODO: confirm the existing list request params on BE
type ListRequestParams<Ordering = string> = Partial<{
  ordering: Ordering;
  limit: "all" | number;
  offset: number;
  search: string;
  cursor: string;
}>;

interface HipoApiErrorShape {
  type: string;
  detail: Record<string, undefined | any>;
  fallback_message: string;
}
