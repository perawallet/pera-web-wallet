import "../card-layout/_card-layout.scss";

interface CardLayoutProps {
  children: React.ReactNode;
  hasOverlay?: boolean;
}

function CardLayoutWithoutRoute({children, hasOverlay = false}: CardLayoutProps) {
  return hasOverlay ? (
    <div className={"card-layout-overlay"}>
      <div className={"card-layout-content"}>{children}</div>
    </div>
  ) : (
    <div className={"card-layout"}>{children}</div>
  );
}

export default CardLayoutWithoutRoute;
