import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', isLoading, children, ...props }, ref) => {
    const variants = {
        default: 'bg-gradient-gemini text-white hover:opacity-95 shadow-md shadow-secondary/10 hover:shadow-lg hover:shadow-secondary/20 hover:scale-[1.01] active:scale-[0.98]',
        outline: 'border border-white/10 bg-white/[0.02] hover:bg-white/5 text-slate-200 hover:scale-[1.01] active:scale-[0.98]',
        ghost: 'hover:bg-white/5 text-slate-300 hover:text-white active:scale-[0.98]',
        glass: 'bg-white/5 border border-white/10 hover:bg-white/10 text-white shadow-md hover:scale-[1.01] active:scale-[0.98]',
    };

    const sizes = {
        default: 'h-10 px-5 text-sm font-semibold tracking-wide',
        sm: 'h-8 px-4 text-xs font-semibold',
        lg: 'h-12 px-8 text-base font-semibold',
        icon: 'h-10 w-10',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-40 cursor-pointer relative overflow-hidden',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-inherit" />}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export { Button };
