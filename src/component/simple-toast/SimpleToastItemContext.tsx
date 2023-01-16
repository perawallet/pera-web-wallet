import {createContext} from "react";

const SimpleToastItemContext = createContext<{
  toastId: string;
}>({
  toastId: ""
});

SimpleToastItemContext.displayName = "SimpleToastItemContext";

export {SimpleToastItemContext};
