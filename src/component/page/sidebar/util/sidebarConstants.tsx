import {ReactComponent as TwitterIcon} from "../../../../core/ui/icons/twitter.svg";
import {ReactComponent as DiscordIcon} from "../../../../core/ui/icons/discord.svg";
import {ReactComponent as RedditIcon} from "../../../../core/ui/icons/reddit.svg";

export const SIDEBAR_FOOTER_LINKS = [
  {
    text: "Get Help",
    to: "https://perawallet.app/support/"
  },
  {
    text: "About Pera",
    to: "https://perawallet.app/"
  },
  {
    text: "Pera Explorer",
    to: "https://explorer.perawallet.app/"
  },
  {
    text: "Terms of Use",
    to: "https://perawallet.app/terms-and-services/"
  }
];

export const SIDEBAR_SOCIAL_LINK = [
  {
    icon: <TwitterIcon />,
    to: "https://twitter.com/PeraAlgoWallet"
  },
  {
    icon: <DiscordIcon />,
    to: "https://discord.com/invite/gR2UdkCTXQ"
  },
  {
    icon: <RedditIcon />,
    to: "https://www.reddit.com/r/PeraWallet/"
  }
];
