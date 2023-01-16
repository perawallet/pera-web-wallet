import {useLayoutEffect} from "react";

function useSetPageTitle(title: string) {
  useLayoutEffect(() => {
    document.title = `${title} | Pera Wallet`;
  }, [title]);
}

export default useSetPageTitle;
