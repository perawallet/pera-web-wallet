import {ReactComponent as UploadIcon} from "../../../core/ui/icons/upload.svg";
import {ReactComponent as CheckmarkIcon} from "../../../core/ui/icons/checkmark.svg";
import {ReactComponent as CloseIcon} from "../../../core/ui/icons/close.svg";

import {ReactNode} from "react";
import {Spinner} from "@hipo/react-ui-toolkit";

import {FileInputState} from "./FileInput";

const FILE_INPUT_LABELS: Record<FileInputState, {label: string; icon: ReactNode}> = {
  idle: {
    label: "Select your backup file",
    icon: (
      <div className={"file-input__icon-wrapper"}>
        <UploadIcon />
      </div>
    )
  },
  loading: {
    label: "Uploading",
    icon: (
      <div className={"file-input__icon-wrapper"}>
        <Spinner />
      </div>
    )
  },
  fail: {
    label: "Upload Failed",
    icon: (
      <div className={"file-input__icon-wrapper file-input__icon-wrapper--fail"}>
        <CloseIcon />
      </div>
    )
  },
  success: {
    label: "Upload Success",
    icon: (
      <div className={"file-input__icon-wrapper file-input__icon-wrapper--success"}>
        <CheckmarkIcon />
      </div>
    )
  }
};

export {FILE_INPUT_LABELS};
