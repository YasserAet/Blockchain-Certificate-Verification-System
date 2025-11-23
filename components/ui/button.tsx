import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variantStyles = {
      default: "bg-accent text-primary hover:bg-accent-light",
      outline: "border border-border text-foreground hover:bg-primary-lighter",
      ghost: "text-foreground hover:bg-primary-lighter",
      destructive: "bg-danger text-foreground hover:bg-danger/90",
    }
    
    const sizeStyles = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
    }

    return (
      <Comp
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
