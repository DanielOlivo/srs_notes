import type { FC } from "react";
import { useParams } from "react-router";
import { HeaderElements } from "../../../common/components/HeaderElements";

export const NoteEditHeaderElements: FC = () => {
    const { noteId } = useParams<{noteId: string}>()

    return (
        <HeaderElements
            buttonType="back"
            title={noteId ? "Edit note" : "Create note"}
        />
    )
}