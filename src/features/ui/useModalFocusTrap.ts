import { useEffect } from "react";

export default function useModalFocusTrap<T extends HTMLElement>(
    ref: React.RefObject<T | null>,
    active: boolean,
    onExit: () => void,
): void {
    useEffect(() => {
        if (ref.current && active) {
            const modalElement = ref.current;
            const focusableElements = modalElement.querySelectorAll('button');

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            const handleTabKeyPress = (event: KeyboardEvent) => {
                if (event.key === 'Tab') {
                    if (event.shiftKey && document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    } else if (
                        !event.shiftKey &&
                        document.activeElement === lastElement
                    ) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            };

            const handleEscapeKeyPress = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    onExit();
                }
            };

            modalElement.addEventListener('keydown', handleTabKeyPress);
            modalElement.addEventListener('keydown', handleEscapeKeyPress);

            return () => {
                modalElement.removeEventListener('keydown', handleTabKeyPress);
                modalElement.removeEventListener('keydown', handleEscapeKeyPress);
            }
        }
    }, [ref.current, active, onExit]);
}