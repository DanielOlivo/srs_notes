import { useRef, useState, type FC } from "react";
import type { BasicNoteDto } from "../../notes/notes.dto";
import { useForm } from "react-hook-form";
import { useGetNoteQuery, useUpdateBasicNoteMutation } from "../../notes/note.api";

type Input = {
    front: string
    back: string
}

export const NoteItem: FC<BasicNoteDto> = ({id}) => {

    const [onEdit, setOnEdit] = useState(false)
    const {data: note } = useGetNoteQuery(id) 
    const [updateNote, ] = useUpdateBasicNoteMutation()

    const {
        register,
        handleSubmit
    } = useForm<Input>({
        values: note ? { front: note.front, back: note.back } : undefined
    })

    const handleDoubleClick = () => {
        if(!onEdit){
            setOnEdit(true)
        }
    }

    const onSubmit = (data: Input) => {
        updateNote({id, ...data})
        setOnEdit(false)
    }

    const onBlur = handleSubmit(onSubmit)

    const frontReg = register("front", {required: true})
    const backReg = register("back", {required: true})

    return (
        <tr>
            <td className="text-ellipsis max-w-20 overflow-hidden text-nowrap">{id}</td>
            <td>
                <input
                    type="text"
                    onDoubleClick={handleDoubleClick}
                    {...frontReg}
                    onBlur={(e) => {
                        frontReg.onBlur(e)
                        onBlur(e)
                    }}
                />
            </td>
            <td>
                <input
                    type="text"
                    onDoubleClick={handleDoubleClick}
                    {...backReg}
                    onBlur={(e) => {
                        backReg.onBlur(e)
                        onBlur(e)
                    }}
                />
            </td>
        </tr>
    )
}