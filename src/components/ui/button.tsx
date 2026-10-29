import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-btn)] font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-[1.1em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-racing text-paper hover:bg-racing-dark",
        light: "bg-paper text-ink hover:bg-white",
        dark: "bg-ink text-paper hover:bg-midnight",
        outline: "border border-current/30 hover:border-current",
        text: "h-auto! px-0! underline decoration-1 underline-offset-[0.35em] decoration-current/40 hover:decoration-current",
      },
      size: {
        sm: "h-10 px-4 text-[0.9rem]",
        md: "h-12 px-6 text-[0.95rem]",
        lg: "h-14 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ComponentProps<"button"> & Variants) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function ButtonLink({ className, variant, size, ...props }: ComponentProps<typeof Link> & Variants) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
