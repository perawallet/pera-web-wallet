import "./_page.scss";

import classNames from "classnames";
import {Outlet} from "react-router-dom";

import PageHeader from "./header/PageHeader";
import useSetPageTitle from "../../core/util/hook/useSetPageTitle";

interface PageProps {
  title: string;
  customClassName?: string;
  banner?: React.ReactNode;
}

function Page({customClassName, title, banner}: PageProps) {
  useSetPageTitle(title);

  return (
    <div className={classNames("page", customClassName)}>
      <div className={"page__header-wrapper"}>
        {banner}

        <PageHeader />
      </div>

      <main className={"page-content"}>
        <Outlet />
      </main>
    </div>
  );
}

export default Page;
