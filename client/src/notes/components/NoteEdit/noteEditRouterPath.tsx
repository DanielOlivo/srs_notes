import type { RouteObject } from "react-router";
import { NoteEdit } from "./NoteEdit";
import { NoteEditHeaderElements } from "./NoteEditHeaderElements";

const base = {
    Component: NoteEdit,
    handle: {
        header: <NoteEditHeaderElements />
    }
}

export const addNoteRouterPath = {
    path: "addNote",
    ...base
} satisfies RouteObject

export const addNoteAtPosRouterPath = {
    path: "addNote/:posY/:posX",
    ...base
} satisfies RouteObject

export const editNoteRouterPath = {
    path: "noteEdit/:noteId",
    ...base
} satisfies RouteObject
