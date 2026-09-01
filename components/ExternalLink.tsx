import type { ComponentProps } from "react";

/**
 * A link that opens in a new tab.
 *
 * `rel="noopener noreferrer"` is the reason this exists rather than being an
 * inline anchor at each call site: `target="_blank"` without it hands the new
 * page a reference back to this one.
 */
export function ExternalLink({
  href,
  className,
  children,
  ...props
}: ComponentProps<"a">) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}
