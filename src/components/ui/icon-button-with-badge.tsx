import { Button } from "./button";
import { Badge } from "./badge";
import * as React from "react";

export type IconButtonWithBadgeProps = {
  icon: React.ElementType;
  count?: number;
  label: string;
  onClick?: () => void;
  active?: boolean;
};

export function IconButtonWithBadge({ icon: Icon, count, label, onClick, active }: IconButtonWithBadgeProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer bg-[var(--color-background)] text-[var(--color-foreground)] hover:bg-[var(--color-background)] hover:text-[var(--color-foreground)]${active ? " ring-2 ring-blue-500" : ""}`}
    >
      <span className="relative w-5 h-5 flex items-center justify-center">
        <Icon size={20} />
        {typeof count === "number" && count > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-1 min-w-[13px] h-4 px-0.5 rounded-full flex items-center justify-center text-[10px]"
          >
            {count > 99 ? "99+" : count}
          </Badge>
        )}
      </span>
    </Button>
  );
} 