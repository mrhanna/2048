import { useEffect } from "react";

export default function useClickOutside<T extends HTMLElement>(
    ref: React.RefObject<T | null>,
    handler: (e?: TouchEvent | MouseEvent) => void,
): void {
    useEffect(() => {
        const handleClickOutside = (e: TouchEvent | MouseEvent) => {
            if (!ref.current || ref.current.contains(e.target as Node)) {
                return;
            }

            handler(e);
        };

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [ref, handler])
}