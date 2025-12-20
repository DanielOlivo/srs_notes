import type { FC } from "react"
import type { BasicNoteDto } from "../../notes.dto"
import { useGetNoteConfigQuery } from "../../../grid/grid.api"
import { useOpeningHook } from "../../../grid/hooks"

export interface BasicNoteProps {
    note: BasicNoteDto
    gridId: string
}

export const BasicNote: FC<BasicNoteProps> = ({note: {id, front, back}, gridId}) => {

    const { data: config, isError, isLoading, isUninitialized } = useGetNoteConfigQuery({noteId: id, gridId});
    const { isOpen } = useOpeningHook(config?.lastOpenTimestamp, config?.currentOpenInterval, isUninitialized || isLoading);

    if(isLoading || isUninitialized){
        return <div>Loading...</div>
    }

    if(isError){
        return <div>Error occurred</div>
    }

    if(!config){
        return <div>config is null</div>
    }

    return (
        <div className="w-full h-full">
            <span style={{
                color: isOpen ? "green" : "red"
            }}>{isOpen ? front : back}</span>
        </div>
    )
}