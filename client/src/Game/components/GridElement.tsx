import { type FC, type PropsWithChildren, useMemo } from "react";

export interface GridElementProps {
    x: number
    y: number
    cellSize: {
        width: number
        height: number
    },
    position: { x: number; y: number; z: number; };
}

export const GridElement: FC<PropsWithChildren<GridElementProps>> = ({x, y, cellSize, children, position}) => {

    const style = useMemo(() => {
        // 1. Set the element's base position and size in the "world" space.
        const worldX = x * cellSize.width;
        const worldY = y * cellSize.height;

        return {
            position: 'absolute' as const,
            transform: `translate(${-position.x * position.z}px, ${-position.y * position.z}px) scale(${position.z})`,
            transformOrigin: 'top left',
            left: `${worldX}px`,
            top: `${worldY}px`,
            width: `${cellSize.width}px`,
            height: `${cellSize.height}px`,
            background: '#f0f0f0',
            border: '1px solid #ccc',
            padding: '0px',
            userSelect: 'none',
        };
    }, [x, y, cellSize, position]);

    return (
        <div style={style}>
            {children}
        </div>
    );
};