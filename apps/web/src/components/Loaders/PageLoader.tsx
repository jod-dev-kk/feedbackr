import { Spinner } from "@repo/ui";

const PageLoader = ({
  title = "Setting up your workspace...",
  size = "lg",
  variant = "primary",
}: {
  title?: string;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "primary" | "neutral";
}) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-3 px-3 lg:px-0">
      <Spinner variant={variant} size={size} />
      <p className="text-neutral-500 animate-pulse">{title}</p>
    </div>
  );
};

export default PageLoader;
