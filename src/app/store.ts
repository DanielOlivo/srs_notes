import { configureStore } from "@reduxjs/toolkit";
// import gridReducer, { initialState as gridInitialState } from '../grid/grid.slice'
import { api } from "../api";
// import { GridApiUtils, type GridApiData } from "../grid/grid.api";
import { handleNoteCache, type NoteApiData } from "../notes/note.api";
import { listReducer } from "../List/list.slice";
import themeReducer from "../theme/theme.slice"


export const getStore = () => configureStore({
    reducer: {
        // gridReducer,
        listReducer, 
        themeReducer,
        [api.reducerPath]: api.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})


export const store = getStore()

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof getStore>;

type SlicesOnlyState = Omit<RootState, "api">

export type StoreState = {
    slices?: Partial<SlicesOnlyState>
    // gridApi?: GridApiData
    noteApi?: NoteApiData
}


export const getStoreWithState = ({noteApi }: StoreState) => {

    const initialState: SlicesOnlyState = {
        // gridReducer: slices?.gridReducer ?? gridInitialState,
    }

    const store = configureStore({
        reducer: {
            // gridReducer,
            listReducer,
            themeReducer,
            [api.reducerPath]: api.reducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(api.middleware),
        preloadedState: initialState
    })

    // if(gridApi){
    //     const utils = new GridApiUtils(store)
    //     utils.apply(gridApi)
    // }

    if(noteApi){
        handleNoteCache(noteApi, store)
    } 

    return store
}