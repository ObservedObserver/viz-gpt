
import { useEffect, useState } from "react";
import { IDarkMode } from "./interface";

const DEFAULT_COLOR = "#5B8FF9";
const DARK_COMMON_DESIGN = {
    background: "transparent",
    header: {
        titleColor: "#d1d5db", // change title color to white
        labelColor: "#d1d5db", // change label color to white
    },
    axis: {
        gridColor: "#666",
        domainColor: "#d1d5db", // change axis color to white
        tickColor: "#d1d5db", // change tick color to white
        labelColor: "#d1d5db", // change label color to white
        titleColor: "#d1d5db", // change title color to white
    },
    legend: {
        labelColor: "#d1d5db", // change legend label color to white
        titleColor: "#d1d5db" // change legend title color to white
    },
    view: {
        stroke: '#666'
    }
}
export const VegaTheme = {
    light: {
        background: "transparent",
    },
    dark: DARK_COMMON_DESIGN
} as const;

export function currentMediaTheme(): "dark" | "light" {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
    } else {
        return "light";
    }
}

export function useCurrentMediaTheme(mode: IDarkMode | undefined = 'media'): "dark" | "light" {
    const [theme, setTheme] = useState<"dark" | "light">(mode === 'media' ? currentMediaTheme() : mode);

    useEffect(() => {
        if (mode === 'media') {
            const mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)") as MediaQueryList | undefined;
            const listener = (e: MediaQueryListEvent) => {
                setTheme(e.matches ? "dark" : "light");
            };
            mediaQuery?.addEventListener("change", listener);
            return () => {
                mediaQuery?.removeEventListener("change", listener);
            };
        } else {
            setTheme(mode);
        }
    }, [mode]);

    return theme;
}
