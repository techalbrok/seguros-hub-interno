
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "button-primary text-primary-foreground hover:shadow-lg transform hover:scale-105",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground hover:from-destructive/90 hover:to-destructive shadow-lg shadow-destructive/25 hover:shadow-xl hover:shadow-destructive/40 hover:scale-105",
        outline:
          "button-secondary text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105",
        "destructive-outline":
          "border border-destructive/80 bg-background text-destructive hover:bg-destructive hover:text-destructive-foreground shadow-md hover:shadow-lg hover:scale-105",
        secondary:
          "button-secondary text-secondary-foreground hover:scale-105",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105",
        success: "bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/40 hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
