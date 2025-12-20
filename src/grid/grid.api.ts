import { api } from "../api";
import type { AppStore } from "../app/store";
import { getDb, type GridNoteConfig, type Grid, type Note } from "../db/LocalDb";
import { 
    type ReplaceNoteRequestDto,
    type AddNoteToGridRequestDto, 
    type GridDto, 
    type CreateAtlasRequestDto, 
    type RemoveNoteFromGridRequestDto 
} from "../dtos/GridDto";
import { type BasicNoteDto, type NoteDto } from "../notes/notes.dto";
import type { Coord } from "../utils/Coord";
import { NotImplemented } from "../utils/NotImplemented";
import { 
    type NoteConfigRequest, 
    type NoteAtCoordRequestDto, 
    type GridNoteConfigDto,
    type GridItemDto
} from "./grid.dto";
import { dummyNoteConfigs, dummyNotes } from "./grid.dummy";


export const gridApi = api.injectEndpoints({
    endpoints: builder => ({


        getGridList: builder.query<GridItemDto[], void>({
            queryFn: async() => {
                // const db = await getDb()

                // return { data: await db.getGridList()}
                return { data: []}
            }
        }),

        createGrid: builder.mutation<void, CreateAtlasRequestDto>({
            queryFn: async(dto) => ({
                data: undefined
            })
        }),

        updateGrid: builder.mutation<void, GridDto>({
            queryFn: async(dto) => ({
                data: undefined
            })
        }),

        deleteGrid: builder.mutation<void, string>({
            queryFn: async(id) => ({
                data: undefined
            })
        }),

        getNoteAtCoord: builder.query<NoteDto | null, NoteAtCoordRequestDto>({
            queryFn: async(req) => {
                try{
                    if(req.coord.x === 0 && req.coord.y === 0){
                        console.log('fetching...')
                    }
                    return { data: null}
                }
                catch(error){
                    return { error }
                }
            },
            serializeQueryArgs: ({ queryArgs }) => `getNoteAtCoord(${queryArgs.gridId},${queryArgs.coord.x},${queryArgs.coord.y})`,
        }),

        getNotesAroundCoord: builder.query<BasicNoteDto[], Coord>({
            queryFn: async(coord) => {
                try{
                    throw new NotImplemented();
                }
                catch(error){
                    return { error: { message: String(error) } }
                }
            }
        }),

        getNoteConfig: builder.query<GridNoteConfigDto | null, NoteConfigRequest>({
            queryFn: async({gridId, noteId}) => {
                try{
                    // this is a dummy implementation
                    const config = dummyNoteConfigs.find(c => c.noteId === noteId) 
                    if(!config) return { data: null }
                    return { data: config }

                    // const db = await getDb();
                    // const config = await db.getNoteConfig(gridId, noteId)
                    // return { data: config }
                }
                catch (error){
                    return { error: { message: String(error) } }
                }
            }
        }),

        addNote: builder.mutation<void, AddNoteToGridRequestDto>({
            queryFn: async(req) => ({
                data: undefined
            })
        }),

        replaceNote: builder.mutation<void, ReplaceNoteRequestDto>({
            queryFn: async(req) => ({
                data: undefined
            })
        }),

        removeNote: builder.mutation<void, RemoveNoteFromGridRequestDto>({
            queryFn: async(req) => ({
                data: undefined
            })
        })

    })
})

export const {
    useGetGridListQuery,
    useGetNoteAtCoordQuery,
    useGetNoteConfigQuery
} = gridApi;


export type GridApiData = {
    getNoteAtCoord?: {req: NoteAtCoordRequestDto, res: NoteDto | null}[]
    getGridList?: GridItemDto[]
}

export class GridApiUtils {

    private readonly store: AppStore

    constructor(store: AppStore){
        this.store = store
    }

    apply(data: GridApiData){

        if(data.getGridList){
            this.setGridItems(data.getGridList)
        }

        if(data.getNoteAtCoord){
            for(const {req, res} of data.getNoteAtCoord){
                this.setNoteAtCoord(req, res)
            }
        }
    }

    setGridItems (items: GridItemDto[]) {
        this.store.dispatch(
            gridApi.util.upsertQueryData("getGridList", undefined, items)
        )
    }

    setNoteAtCoord (req: NoteAtCoordRequestDto, noteOption: NoteDto | null) {
        this.store.dispatch(
            gridApi.util.upsertQueryData("getNoteAtCoord", req, noteOption)
        )
    }
}
