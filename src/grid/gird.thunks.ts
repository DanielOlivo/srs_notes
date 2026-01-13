import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../app/store";
import type { Vector2 } from "../utils/Coord";
import { gridApi } from "./grid.api";
import type { NoteAtCoordRequestDto } from "./grid.dto";

let pendingCoordinates: Vector2[] = []
let batchTimer: number | null = null;
const BATCH_DELAY_MS = 100;

export const requestCellData = createAsyncThunk<void, Vector2, { dispatch: AppDispatch, state: RootState}> (
    "grid/requestCellData",
    async (req: NoteAtCoordRequestDto, {dispatch, getState}) => {
        const { coord, gridId } = req
        const cellQueryState = gridApi.endpoints.getNoteAtCoord.select(req)(getState());       
        if(cellQueryState.isUninitialized){
            if(!pendingCoordinates.some(p => p.x === coord.x && p.y === coord.y)){
                pendingCoordinates.push(coord);
            }
        }
        else {
            return // already fetched
        }

        if(batchTimer){
            clearTimeout(batchTimer);
        }

        batchTimer = setTimeout(() => {
            const coordsToFetch = [...pendingCoordinates]
            pendingCoordinates = []

            if(coordsToFetch.length > 0){
                dispatch(gridApi.endpoints.getNoteAtCoord.initiate(coordsToFetch))
            }
        }, BATCH_DELAY_MS)
    }
)