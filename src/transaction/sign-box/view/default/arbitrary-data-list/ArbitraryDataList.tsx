import "./_arbitrary-data-list.scss";

import {ReactComponent as FingerprintIcon} from "../../../../../core/ui/icons/fingerprint.svg";

import {List, ListItem} from "@hipo/react-ui-toolkit";

import {ArbitraryData} from "../../../../../core/util/model/peraWalletModel";

function ArbitraryDataList({data}: {data: ArbitraryData[]}) {
  return (
    <List items={data} customClassName={"arbitrary-data-list"}>
      {(arbitraryData) => (
        <ListItem customClassName={"arbitrary-data-list-item"}>
          <span className={"arbitrary-data-list-item__icon-wrapper"}>
            <FingerprintIcon width={24} height={24} />
          </span>

          <div className={"arbitrary-data-list-item__description"}>
            <span className={"typography--medium-body"}>{"Arbitrary Data"}</span>

            <span
              className={
                "arbitrary-data-list__message typography--secondary-body text-color--gray-light"
              }>
              {arbitraryData.message}
            </span>
          </div>
        </ListItem>
      )}
    </List>
  );
}

export default ArbitraryDataList;
