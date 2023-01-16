import "./_info-box.scss";

import {ReactComponent as InfoIcon} from "../../core/ui/icons/info.svg";

import classNames from "classnames";

interface InfoBoxProps {
  infoText: string;
  title?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

function InfoBox({title, infoText, icon, className, children}: InfoBoxProps) {
  const infoBoxClassname = classNames("info-box", className);

  return (
    <div className={infoBoxClassname}>
      <div className={"align-center--horizontally info-box-icon"}>
        {icon || <InfoIcon width={16} height={16} />}
      </div>

      <div className={"info-box-content"}>
        {title && <p className={"typography--medium-body"}>{title}</p>}

        <p className={"typography--secondary-body text-color--gray info-box-text"}>
          {infoText}
        </p>

        {children}
      </div>
    </div>
  );
}

export default InfoBox;
