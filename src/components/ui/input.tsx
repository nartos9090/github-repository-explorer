import * as React from "react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion } from "motion/react"

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-background px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-background file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      sizes: {
        sm: "h-8 px-2.5 !text-sm",
        default: "h-9 px-3 py-2 !text-md",
        lg: "h-10 px-3 py-2 !text-lg",
        xl: "h-11 px-3.5 py-2.5 !text-xl",
      }
    },
    defaultVariants: {
      sizes: "default",
    }
  })

const hintVariants = cva(
  "text-red-500 text-sm mt-1 overflow-hidden",
  {
    variants: {
      sizes: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-md",
        xl: "text-lg",
      },
    },
    defaultVariants: {
      sizes: "default",
    }
  }
)

function Input({
  className,
  type = "text",
  sizes,
  error,
  noHint = false,
  ...props
}: React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants> & {
    error?: string;
    noHint?: boolean;
  }) {
  return (
    <div className="space-y-1">
      <input
        type={type}
        data-slot="input"
        className={cn(
          inputVariants({ className, sizes }),
          error && "outline outline-2 outline-red-500 border-red-500"
        )}
        aria-invalid={!!error}
        {...(type === "file" ? { accept: ".png,.jpg,.jpeg,.gif,.webp" } : {})}
        {...(type === "number" ? { inputMode: "numeric", pattern: "[0-9]*" } : {})}
        {...(type === "email" ? { inputMode: "email", pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$" } : {})}
        {...props}
      />
      <div
        className={cn(
          "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
          noHint ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
        )}
        aria-live="polite"
      >
        <AnimatePresence>
          {error && (
            <motion.p
              className={cn(hintVariants({ sizes: sizes }))}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export { Input }
