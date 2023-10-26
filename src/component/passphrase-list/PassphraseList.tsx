import "./_passphrase-list.scss";

import {List, ListItem} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

function PassphraseList({
  passphrase,
  customClassname
}: {
  passphrase: string;
  customClassname?: string;
}) {
  return (
    <List
      items={passphrase!.split(" ")}
      customClassName={classNames("passphrase-list", customClassname)}
      type={"ordered"}>
      {(word) => <ListItem customClassName={"passphrase-list-item"}>{word}</ListItem>}
    </List>
  );
}

export default PassphraseList;
