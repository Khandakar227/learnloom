import { forwardRef } from "react"
import { cn } from './cn'

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { 
        id: string;
        label: string;
    }


const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ id, label, className, type, ...props }, ref) => {
        return (
            <div className="grid w-full items-center gap-1.5">
                <label htmlFor={id}>{label}</label>
                <input
                    type={type}
                    className={cn(
                        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    id={id}
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)

export default Input;
