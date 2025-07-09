import React, { useEffect, useState } from "react";

interface ExitWrapperProps {
    children: React.ReactElement<any>,
    show: boolean,
    exitingClassName: string,
    exitAnimationTimeMilliseconds: number,
}

export default function ExitWrapper({
    children,
    show,
    exitingClassName = 'exiting',
    exitAnimationTimeMilliseconds,
}: ExitWrapperProps) {
    const [shouldDisplay, setShouldDisplay] = useState(show);

    useEffect(() => {
        if (show) {
            setShouldDisplay(true);
        } else if (shouldDisplay) {
            const timeout = setTimeout(() => setShouldDisplay(false), exitAnimationTimeMilliseconds);
            return () => {
                clearTimeout(timeout);
            }
        }
    }, [show, shouldDisplay, exitAnimationTimeMilliseconds]);

    const shouldRender = shouldDisplay || show;

    if (!shouldRender) return null;

    return React.cloneElement(children, {
        className: `${children.props.className || ''} ${!show ? exitingClassName : ''}`
    })
}