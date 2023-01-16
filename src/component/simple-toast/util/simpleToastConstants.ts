import {SimpleToastContextState} from "./simpleToastTypes";

const DEFAULT_SIMPLE_TOAST_TIMEOUT = 4000;

const initialSimpleToastState: SimpleToastContextState = {
  toast: null,
  defaultAutoCloseTimeout: DEFAULT_SIMPLE_TOAST_TIMEOUT
};

export {DEFAULT_SIMPLE_TOAST_TIMEOUT, initialSimpleToastState};
