import "./_tooltip.scss";

import classNames from "classnames";
import ReactTooltip, {TooltipProps as ReactTooltipProps} from "react-tooltip";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  dataFor: string;
  placement?: ReactTooltipProps["place"];
  customClassName?: string;
}

function Tooltip({content, children, dataFor, placement, customClassName}: TooltipProps) {
  return (
    <div className={classNames("tooltip-container", customClassName)}>
      <div className={"tooltip-trigger"} data-for={dataFor} data-tip={true}>
        {children}
      </div>

      <ReactTooltip
        id={dataFor}
        place={placement}
        className={"tooltip"}
        offset={{top: 6}}>
        <div className={"typography--secondary-body tooltip-content"}>{content}</div>
      </ReactTooltip>
    </div>
  );
}

function OptionalTooltip(props: {withinTooltip: boolean} & TooltipProps) {
  const {withinTooltip, children, ...tooltipProps} = props;

  if (withinTooltip) {
    return <Tooltip {...tooltipProps}>{children}</Tooltip>;
  }

  return <>{children}</>;
}

Tooltip.Optional = OptionalTooltip;

export default Tooltip;
