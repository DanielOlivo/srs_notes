import { 
    useMemo, 
    useRef, 
    useState, 
    type FC, 
    type ReactNode } from "react";
import type { Vector2 } from "../../../utils/Coord";
import { Cell } from "../Cell/Cell";
import { isEditMode, setOnMoving, type OnMoving } from "../../grid.slice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCurrentMode } from "../../grid.selectors";

export interface GridProps {
    cellSize: {
        width: number,
        height: number
    },
    gap: number
}

export const Grid: FC<GridProps> = ({cellSize, gap}) => {

    const dispatch = useAppDispatch()
    const viewRef = useRef<HTMLDivElement>(null);
    const didPanRef = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentMode = useAppSelector(selectCurrentMode)

    const [panning, setPanning] = useState({
        isMouseDown: false,
        isPanning: false,
        start: {x: 0, y: 0},
        position: { x: 0, y: 0 },
        scale: 1,
        cellIndexes: {
            startX: 0,
            startY: 0,
            countX: 10,
            countY: 10
        }
    })

    const containerStyle = useMemo((): React.CSSProperties => ({
        position: "absolute",
        width: "8px",
        height: "8px",
        backgroundColor: "red",
        transform: `translate(${panning.position.x}px, ${panning.position.y}px) scale(${panning.scale})`
    })
    , [panning.position, panning.scale])

    const calculateCellIndexes = (position: Vector2, scale: number) => {
        if (!viewRef.current) return panning.cellIndexes;
        return {
            startX: Math.floor(-position.x / ((cellSize.width + gap) * scale)),
            startY: Math.floor(-position.y / ((cellSize.height + gap) * scale)),
            countX: Math.ceil(viewRef.current.offsetWidth / ((cellSize.width + gap) * scale)) + 1,
            countY: Math.ceil(viewRef.current.offsetHeight / ((cellSize.height + gap) * scale)) + 1,
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
        // e.preventDefault();
        // e.stopPropagation();

        if(isEditMode(currentMode) && currentMode.isOver !== null){
            const onMoving: OnMoving = {
                client: {
                    x: e.clientX,
                    y: e.clientY
                },
                dragStart: {
                    x: panning.position.x + e.clientX,
                    y: panning.position.y + e.clientY
                }
            } 
            dispatch(setOnMoving(onMoving))
            return
        }

        setPanning((p) => ({
            ...p,
            isMouseDown: true,
            // isPanning: true,
            start: {x: e.clientX, y: e.clientY},
        }))
    }

    const handleMouseUpCapture = (e: React.MouseEvent<HTMLDivElement>) => {
        if(isEditMode(currentMode) && currentMode.onMoving){
            dispatch(setOnMoving(null))
            return
        }

        setPanning((p) => ({
            ...p,
            isMouseDown: false,
            isPanning: false,
        }));
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {

        if(isEditMode(currentMode) && currentMode.onMoving){
            dispatch(setOnMoving({
                ...currentMode.onMoving,
                client: {
                    x: e.clientX,
                    y: e.clientY
                }
            }))
            return
        }

        if(!panning.isMouseDown) return;

        e.stopPropagation();

        const dx = e.clientX - panning.start.x;
        const dy = e.clientY - panning.start.y;

        const getIsPanning = () => Math.abs(dx) > 10 || Math.abs(dy) > 10

        if(!didPanRef.current){
            didPanRef.current = getIsPanning();
        }

        setPanning(p => {
            const newPosition = { x: p.position.x + dx, y: p.position.y + dy };
            return {
                ...p,
                position: newPosition,
                isPanning: p.isPanning || getIsPanning(),
                start: { x: e.clientX, y: e.clientY },
                cellIndexes: calculateCellIndexes(newPosition, p.scale)
            };
        });
    }

    const handleZoom = (p: React.WheelEvent<HTMLDivElement>) => {
        if (panning.isPanning) return;
        p.preventDefault();
        p.stopPropagation();

        const rect = viewRef.current!.getBoundingClientRect();
        const zoomSpeed = 0.5;

        // Determine the new scale
        const delta = p.deltaY > 0 ? -1 : 1;
        let newScale = panning.scale + delta * zoomSpeed * panning.scale;
        if(newScale < 0.1) newScale = 0.1;
        if(newScale > 10) newScale = 3;

        // Get mouse position relative to the view
        const mouseX = p.clientX - rect.left;
        const mouseY = p.clientY - rect.top;

        // Calculate the new position to zoom towards the mouse
        const newX = mouseX - (mouseX - panning.position.x) * (newScale / panning.scale);
        const newY = mouseY - (mouseY - panning.position.y) * (newScale / panning.scale);

        setPanning(prev => {
            const newPosition = { x: newX, y: newY };
            return {
                ...prev,
                scale: newScale,
                position: newPosition,
                cellIndexes: calculateCellIndexes(newPosition, newScale)
            };
        });
    }

    const handleCells = useMemo(() => {
        const cells: ReactNode[] = []
        for(let x = panning.cellIndexes.startX; x < panning.cellIndexes.startX + panning.cellIndexes.countX; x++){
            for(let y = panning.cellIndexes.startY; y < panning.cellIndexes.startY + panning.cellIndexes.countY; y++){
                // cells.push(cell(x, y))
                cells.push(<Cell 
                    gridId="1" 
                    coord={{x, y}} 
                    gap={gap} 
                    cellSize={cellSize} 
                    key={`${x} ${y}`} 
                />)
            }
        }
        return cells
    }, [
        panning.cellIndexes.startX, 
        panning.cellIndexes.startY, 
        panning.cellIndexes.countX, 
        panning.cellIndexes.countY, 
        gap,
        cellSize,
        // panning.scale
    ])

    const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
        if (didPanRef.current) {
            e.stopPropagation();
            e.preventDefault();
            didPanRef.current = false;
        }
    };

    return (
        <div 
            ref={viewRef}
            className="relative w-full h-full overflow-hidden m-0 p-0 border-2 border-black "
            // onMouseDownCapture={handleMouseDown}
            onMouseDown={handleMouseDown}
            onMouseUpCapture={handleMouseUpCapture}
            onMouseMoveCapture={handleMouseMove}
            onWheel={handleZoom}
            onClickCapture={handleClickCapture}
        >
            <div 
                ref={containerRef}
                style={containerStyle}
            >
                {handleCells}
            </div>

            {panning.isPanning && <div 
                style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "green",
                    position: 'absolute',
                    top: `${panning.start.y}px`,
                    left: `${panning.start.x}px`,
                }} 
            />}

            <div className="absolute opacity-35 select-none">
                <p>isMouseDown: {panning.isMouseDown.toString()}</p>
                <p>isPanning: {panning.isPanning.toString()}</p>
                <p>position: {panning.position.x} {panning.position.y}</p>
                <p>scale: {panning.scale}</p>
                <p>cell-x: {panning.cellIndexes.startX}</p>
                <p>cell-y: {panning.cellIndexes.startY}</p>
                <p>start indexes: {panning.cellIndexes.startX} {panning.cellIndexes.startY}</p>
                {isEditMode(currentMode) && <p>isOver: {currentMode.isOver?.x} {currentMode.isOver?.y}</p>}
            </div>
        </div>
    )
}