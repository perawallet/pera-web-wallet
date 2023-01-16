export interface SimpleToastData {
  message: string;
  type?: "info" | "success" | "error";
  id?: string;
  timeout?: number;
  customClassName?: string;
}

export type SimpleToastAction =
  | {
      type: "DISPLAY";
      toastData: Omit<SimpleToastData, "id"> & {id: string};
    }
  | {type: "HIDE"}
  | {
      type: "SET_DEFAULT_AUTO_CLOSE_TIMEOUT";
      timeout: number;
    };

export interface SimpleToastContextState {
  toast: (Omit<SimpleToastData, "id"> & {id: string}) | null;
  defaultAutoCloseTimeout: number;
}
