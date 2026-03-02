import React, { useState, useRef, useMemo, type FC, type MouseEvent, type WheelEvent, type ReactNode, useLayoutEffect } from "react";
import { GridElement } from "./GridElement";
import { type Vector2 } from "../../utils/Vector2";


export interface GridProps {
    getItem: (coord: Vector2) => ReactNode | null
    cellSize: {
        width: number
        height: number
    }
}

/*
* Grid Component
* 
* - Renders a virtualized grid of items.
* - Supports panning (click and drag) and zooming (mouse wheel).
* - Dynamically requests items for visible cells via the `getItem` prop.
*/

export const Grid: FC<GridProps> = ({getItem, cellSize}) => {

    const containerRef = useRef<HTMLDivElement>(null);

    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const [isPanning, setIsPanning] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0, z: 1 }); 
    const panOrigin = useRef({ gridX: 0, gridY: 0, mouseX: 0, mouseY: 0 });

    const [indices, setIndices] = useState({
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
    });
    
    const handleMouseDown = (e: MouseEvent) => {
        // Prevent browser's default drag behavior
        e.preventDefault();
        e.stopPropagation();
        
        setIsPanning(true);
        panOrigin.current = {
            gridX: position.x,
            gridY: position.y,
            mouseX: e.clientX,
            mouseY: e.clientY,
        };
    }

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const { width, height } = container.getBoundingClientRect();
        setContainerSize({ width, height });

        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
            }
        });

        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, []);

    const handleMouseUp = (e: MouseEvent) => {
        setIsPanning(false);
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isPanning) return;

        // Calculate the total mouse movement from the pan origin
        const dx = e.clientX - panOrigin.current.mouseX;
        const dy = e.clientY - panOrigin.current.mouseY;

        // Apply the delta to the grid's position at the start of the pan
        const newX = panOrigin.current.gridX - (dx / position.z);
        const newY = panOrigin.current.gridY - (dy / position.z);
        
        setPosition({ ...position, x: newX, y: newY });
    }

    const handleScale = (e: WheelEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left; // Mouse position relative to the container
        const mouseY = e.clientY - rect.top;

        const zoomFactor = 1.1;
        // let newZoom = e.deltaY < 0 ? position.z * zoomFactor : position.z / zoomFactor;
        let newZoom = position.z + e.deltaY * 0.001;
        if(newZoom < 0.1) newZoom = 0.1; 
        else if(newZoom > 5) newZoom = 5;

        // Calculate world coordinates under the mouse before zoom
        const worldX = (mouseX / position.z) + position.x;
        const worldY = (mouseY / position.z) + position.y;

        // Calculate new top-left position to keep the point under the mouse stationary
        const newX = worldX - (mouseX / newZoom);
        const newY = worldY - (mouseY / newZoom);

        setPosition({ x: newX, y: newY, z: newZoom });
    }

    const visibleItems = useMemo(() => {
        if (containerSize.width === 0 || containerSize.height === 0) return [];

        const { width, height } = containerSize;
        const { z } = position;
        const { width: cellWidth, height: cellHeight } = cellSize;

        // Calculate the range of visible cell indices
        const startX = Math.floor(position.x / cellWidth);
        const startY = Math.floor(position.y / cellHeight);
        const endX = Math.ceil((position.x + width / z) / cellWidth);
        const endY = Math.ceil((position.y + height / z) / cellHeight);

        setIndices({ startX, startY, endX, endY });

        const items: ReactNode[] = [];
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const itemContent = getItem({ x, y });
                if (itemContent) {
                    items.push(
                        <GridElement key={`${x}-${y}`} x={x} y={y} cellSize={cellSize} position={position}>
                            {itemContent}
                        </GridElement>
                    );
                }
            }
        }
        return items;
    }, [position, getItem, cellSize, containerSize]);

    return (
        <div
            ref={containerRef} 
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // Stop panning if mouse leaves the container
            onMouseMove={handleMouseMove}
            onWheel={handleScale}
            style={{ 
                position: 'relative',
                width: '100%', 
                height: '100%', 
                overflow: 'hidden', 
                cursor: isPanning ? 'grabbing' : 'grab',
                border: "1px solid black"
            }}
        >{visibleItems}

            {/* <div
                className="absolute top-1 left-1 flex flex-col items-start justify-start bg-slate-100 opacity-55" 
            >
                <span>x: {position.x}</span>
                <span>y: {position.y}</span>
                <span>z: {position.z}</span>
                <span>isPaning: {isPanning ? 'true' : 'false'}</span>
                <span>visible items count: {visibleItems.length}</span>
                <span>indices: {JSON.stringify(indices)}</span>
            </div> */}
        </div>
    )
}