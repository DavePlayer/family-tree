import { useState, useEffect } from "react";

export const useContainerDimensions = (
    containerRef: React.MutableRefObject<any>,
    dependencies?: Array<any>
) => {
    const deps = Array.isArray(dependencies) ? dependencies : [];
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (containerRef) {
            listenToResize();
            window.addEventListener("resize", listenToResize);
        }
        setTimeout(() => {
            listenToResize();
        }, 1000);
        return () => window.removeEventListener("resize", listenToResize);
    }, [containerRef, containerRef.current, ...deps]);

    const listenToResize = () => {
        const width = containerRef
            ? containerRef.current
                ? containerRef.current.clientWidth
                : 0
            : 0;
        const height = containerRef
            ? containerRef.current
                ? containerRef.current.clientHeight
                : 0
            : 0;
        //console.log(containerRef, width, height);
        setDimensions({ width, height });
    };

    return dimensions;
};

export const calculateDimensions = (containerRef: React.MutableRefObject<any>) => {
    const width =
        containerRef !== null
            ? containerRef.current !== null
                ? containerRef.current.clientWidth
                : 0
            : 0;
    const height =
        containerRef !== null
            ? containerRef.current !== null
                ? containerRef.current.clientHeight
                : 0
            : 0;

    return { width, height };
};
