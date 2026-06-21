import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                'flex h-11 w-full rounded-full border border-white/10 bg-slate-950/20 px-5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = 'Input';

export { Input };
