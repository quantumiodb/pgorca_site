import Link from "next/link";
import type { ComponentProps } from "react";

export const mdxComponents = {
  a: ({ href = "", children, ...props }: ComponentProps<"a">) => {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 underline decoration-brand-600/30 underline-offset-2 transition hover:decoration-brand-600 dark:text-brand-400 dark:decoration-brand-400/30 dark:hover:decoration-brand-400"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className="text-brand-600 underline decoration-brand-600/30 underline-offset-2 transition hover:decoration-brand-600 dark:text-brand-400 dark:decoration-brand-400/30 dark:hover:decoration-brand-400"
      >
        {children}
      </Link>
    );
  },
};
