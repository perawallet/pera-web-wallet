import "./_page.scss";

import classNames from "classnames";
import {Outlet} from "react-router-dom";

import PageHeader from "./header/PageHeader";
import useSetPageTitle from "../../core/util/hook/useSetPageTitle";
import PageBanner from "./banner/PageBanner";

interface PageProps {
  title: string;
  customClassName?: string;
  customBanner?: React.ReactNode;
}

function Page({customClassName, title, customBanner}: PageProps) {
  useSetPageTitle(title);

  return (
    <div className={classNames("page", customClassName)}>
      <div className={"page__header-wrapper"}>
        {renderBanner()}

        <PageHeader />
      </div>

      <main className={"page-content"}>
        <Outlet />
      </main>
    </div>
  );

  function renderBanner() {
    if (customBanner) {
      return customBanner;
    }

    return <PageBanner />;
  }
}

export default Page;
