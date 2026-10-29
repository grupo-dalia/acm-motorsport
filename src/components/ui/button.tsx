import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export const buttonVariants = cva(
  "group/btn relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-semibold uppercase tracking-[0.08em] transition-[background-color,color,border-color,transform] duration-300 ease-[cubic-bezier(.16,1,.3,1)] disabled:pointer-events-none disabled:opacity-40 active:translate-y-px [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-racing text-paper hover:bg-racing-dark",
        light: "bg-paper text-ink hover:bg-white",
        outline: "border border-line-strong text-paper hover:border-paper hover:bg-paper/5",
        ghost: "text-paper/80 hover:text-paper",
        link: "px-0! text-paper underline-offset-8 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-[0.7rem]",
        md: "h-12 px-6 text-[0.75rem]",
        lg: "h-14 px-8 text-[0.8rem]",
        icon: "size-11",
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
