import "./_account-passphrase-box.scss";

import {List, ListItem} from "@hipo/react-ui-toolkit";

import ClipboardButton from "../../../component/clipboard/button/ClipboardButton";

function AccountPassphraseBox({
  passphrase,
  displayCopyToClipboard = false
}: {
  passphrase: string;
  displayCopyToClipboard?: boolean;
}) {
  return (
    <div className={"account-passphrase-box"}>
      <List
        items={passphrase!.split(" ")}
        customClassName={"account-passphrase-box__passphrase-list"}
        type={"ordered"}>
        {(word) => (
          <ListItem customClassName={"account-passphrase-box__passphrase-list-item"}>
            {word}
          </ListItem>
        )}
      </List>

      {displayCopyToClipboard && (
        <ClipboardButton size={"large"} buttonType={"light"} textToCopy={passphrase}>
          {"Copy passphrase"}
        </ClipboardButton>
      )}
    </div>
  );
}

export default AccountPassphraseBox;
