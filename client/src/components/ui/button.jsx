import { cn } from "../../lib/utils";

const variants = {
  default: "bg-primary text-primary-foreground hover:opacity-90",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  outline: "border border-border bg-card text-foreground hover:bg-muted",
  destructive: "bg-destructive text-white hover:opacity-90",
};

const sizes = {
  default: "h-9 px-3",
  sm: "h-8 px-2 text-xs",
  icon: "h-9 w-9",
};

function Button({
  className = "",
  variant = "default",
  size = "default",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export { Button };
