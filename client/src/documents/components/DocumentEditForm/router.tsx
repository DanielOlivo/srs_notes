import type { RouteObject } from "react-router";
import { DocumentEditForm } from "./DocumentEditForm";
import { DocumentEditHeaderElements } from "./DocumentEditHeaderElements";

const base = {
    Component: DocumentEditForm,
    handle: {
        header: <DocumentEditHeaderElements />
    }
}

export const documentEditRouterPath = {
    path: "edit",
    ...base
} satisfies RouteObject

export const addDocumentRouterPath = {
    path: "add",
    ...base
} satisfies RouteObject