import {useCallback, useEffect, useState} from "react";

const DEFAULT_RESET_TIMEOUT = 2000;

function useClipboard() {
  const [hasCopied, setHasCopiedState] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    let promise;

    try {
      const result = await navigator.permissions.query({
        // @ts-ignore: Type '"clipboard-write"' is not assignable to type 'PermissionName'
        name: "clipboard-write"
      });

      if (result.state === "granted" || result.state === "prompt") {
        try {
          promise = navigator.clipboard.writeText(text);
        } catch (error) {
          promise = copyWithExecCommand(text);
        }
      } else {
        promise = copyWithExecCommand(text);
      }
    } catch (error) {
      promise = copyWithExecCommand(text);
    }

    promise.then(() => setHasCopiedState(true));

    return promise;
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHasCopiedState(false);
    }, DEFAULT_RESET_TIMEOUT);

    return () => {
      clearTimeout(timeout);
    };
  }, [hasCopied]);

  return {hasCopied, setHasCopiedState, copyToClipboard};
}

function copyWithExecCommand(textToCopy: string) {
  return new Promise((resolve, reject) => {
    try {
      const dummyClipboardElement = document.createElement("input");

      document.body.appendChild(dummyClipboardElement);
      dummyClipboardElement.value = textToCopy;
      dummyClipboardElement.select();
      document.execCommand("copy");
      document.body.removeChild(dummyClipboardElement);

      resolve(undefined);
    } catch (error) {
      reject(error);
    }
  });
}

export default useClipboard;
