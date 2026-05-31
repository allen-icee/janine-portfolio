// apps\frontend\src\components\ui\Button.tsx
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { clsx } from "clsx";

type SharedProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

type ButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkButtonProps = SharedProps & AnchorHTMLAttributes<HTMLAnchorElement>;

const variants = {
  primary:
    "border-gold/70 bg-gold text-ink shadow-[0_18px_60px_rgba(238,184,82,0.2)] hover:bg-gold/90",
  secondary:
    "border-white/15 bg-white/8 text-white hover:border-cyan/60 hover:bg-cyan/10",
  ghost: "border-transparent bg-transparent text-white/75 hover:text-white",
};

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-2.5 text-sm font-semibold transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  variant = "primary",
  className,
  ...props
}: LinkButtonProps) {
  return (
    <a
      className={clsx(
        "inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-2.5 text-sm font-semibold transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
