import "./_file-input.scss";

import {useState} from "react";
import {FormField} from "@hipo/react-ui-toolkit";

import {FILE_INPUT_LABELS} from "./fileInputConstants";

export type FileInputState = "idle" | "loading" | "success" | "fail";

type FileInputProps = {
  onFileUpload: (file: string) => void;
};

function FileInput({onFileUpload}: FileInputProps) {
  const [dragActive, setDragActive] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState<FileInputState>("idle");
  const [fileDetails, setFileDetails] = useState<File>();
  const {label, icon} = FILE_INPUT_LABELS[loadingStatus];

  return (
    <FormField
      customClassName={"pera-file-input-label"}
      label={fileDetails?.name || ""}
      labelFor={"import-backup-file-input"}>
      <p className={"typography--button"}>{label}</p>

      {icon}

      <input
        id={"input-file-upload"}
        type={"file"}
        accept={".txt"}
        multiple={false}
        onChange={handleChange}
        className={"pera-file-input"}
      />

      {dragActive && (
        <div
          id={"drag-file-element"}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        />
      )}
    </FormField>
  );

  function handleDrag(e: React.DragEvent<HTMLInputElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLInputElement>) {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    const [file] = e.currentTarget?.files || [];

    if (file) handleFile(file);
  }

  function handleFile(file: File) {
    const reader = new FileReader();

    reader.onloadstart = () => setLoadingStatus("loading");
    reader.onloadend = () => setLoadingStatus("success");
    reader.onerror = () => setLoadingStatus("fail");

    reader.onload = function (event: ProgressEvent<FileReader>) {
      const result = event.target?.result as string;

      if (result) onFileUpload(result);
    };

    setFileDetails(file);

    reader.readAsText(file);
  }

  // triggers when file is selected with click
  function handleChange(e: React.SyntheticEvent<HTMLInputElement>) {
    e.preventDefault();

    const [file] = e.currentTarget?.files || [];

    if (file) handleFile(file);
  }
}

export default FileInput;
