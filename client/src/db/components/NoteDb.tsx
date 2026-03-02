import type { FC } from "react";
import { useGetAllNotesQuery } from "../../grid/grid.api";
import { NoteItem } from "./NoteItem";
import { CreateBasicNote } from "../../notes/components/CreateBasicNote";

export const NoteDb: FC = () => {

    const {data: notes} = useGetAllNotesQuery()

    return (
        <div>
            <div className="overflow-x-auto">
                <table>
                    <thead>

                    </thead>
                    <tbody>
                        {notes?.map(item => <NoteItem {...item} />)}
                    </tbody>
                </table>
            </div>

            <div>
                <CreateBasicNote />
            </div>
        </div>
    )
}