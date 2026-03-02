import { createBrowserRouter, Navigate } from "react-router";
import { Documents } from "./documents/Documents";
import { MainLayout2 } from "./common/components/MainLayout2";
import { DocumentsHeaderElements } from "./documents/components/Headers/DocumentsHeaderElements";
import { ListPage } from "./List/components/ListPage/ListPage";
import { DocumentHeaderElements } from "./List/components/headers/DocumentHeaderElements";
import { addNoteAtPosRouterPath, addNoteRouterPath, editNoteRouterPath } from "./notes/components/NoteEdit/noteEditRouterPath";
import { addDocumentRouterPath, documentEditRouterPath } from "./documents/components/DocumentEditForm/router";
import { documentConfigRouterPath } from "./documents/components/DocumentConfig/router";
import { settingsRouterPath } from "./common/components/Settings/router";
import { aboutRouterPath } from "./common/components/About/router";
import { developmentRouterPath } from "./common/components/Development/router";
import { backupRouterPath } from "./common/components/BackupPage/router";

export const someRouter = createBrowserRouter([
    {
        path: "/srs_notes",
        Component: MainLayout2,
        children: [
            {
                index: true,
                element: <Navigate to="docs" replace />                   
            },

            { 
                path: "docs", 
                children: [
                    {
                        index: true,
                        Component: Documents,
                        handle: {
                            header: <DocumentsHeaderElements />
                        },
                    },

                    addDocumentRouterPath,
                    {
                        path: ":docId",
                        children: [
                            {
                                index: true,
                                Component: ListPage,
                                handle: {
                                    header: <DocumentHeaderElements />
                                }
                            },
                            
                            documentConfigRouterPath,
                            documentEditRouterPath,
                            addNoteRouterPath,
                            addNoteAtPosRouterPath,
                            editNoteRouterPath
                        ]
                    }
                ]
            },

            settingsRouterPath,
            aboutRouterPath,
            developmentRouterPath,
            backupRouterPath,            
        ]
    }
])