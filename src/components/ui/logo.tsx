import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const logoVariants = cva("w-auto shrink-0 select-none", {
  variants: {
    size: {
      sm: "h-5",
      default: "h-6",
      lg: "h-7",
      xl: "h-9",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const logoSrc = {
  wordmark: "/unifize-logo.svg",
  icon: "/icon_logo.svg",
} as const

function Logo({
  className,
  variant = "wordmark",
  size = "default",
  ...props
}: Omit<React.ComponentProps<"img">, "src"> &
  VariantProps<typeof logoVariants> & { variant?: keyof typeof logoSrc }) {
  return (
    <img
      data-slot="logo"
      data-variant={variant}
      src={logoSrc[variant]}
      alt="Unifize"
      className={cn(logoVariants({ size }), className)}
      {...props}
    />
  )
}

export { Logo, logoVariants }
