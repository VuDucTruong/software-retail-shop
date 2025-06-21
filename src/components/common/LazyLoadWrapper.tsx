import { useInView } from 'react-intersection-observer';
import { useState, ReactNode } from 'react';

type LazyLoadWrapperProps = {
    children: () => ReactNode; // ⬅️ make children a function
    rootMargin?: string;
};

export function LazyLoadWrapper({ children, rootMargin = '5px' }: LazyLoadWrapperProps) {
    const [hasRendered, setHasRendered] = useState(false);
    const { ref, inView } = useInView({
        triggerOnce: true,
        rootMargin,
    });

    if (inView && !hasRendered) {
        setHasRendered(true);
    }

    return <div ref={ref}>{hasRendered ? children() : null}</div>; // ⬅️ call only when in view
}
