import { useEffect, useRef } from "react";

export default function usePersistence<T>(key: string, value: T, delayMilliseconds = 300) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            localStorage.setItem(key, JSON.stringify(value));
        }, delayMilliseconds);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [key, value, delayMilliseconds])
}