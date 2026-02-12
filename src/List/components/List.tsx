import { useMemo, type FC } from "react";
import { ListItem } from "./ListItem";
import { useGetDocNotesQuery } from "../../notes/note.api";
import { useAutoScroll } from "../hooks/autoScroll";
import { useDebounce } from "../../common/hooks/useDebounce";

export interface ListProps {
    documentId: string
    height?: number // px
}

export const List: FC<ListProps> = ({documentId, height}) => {

    const { data: noteIds } = useGetDocNotesQuery(documentId)

    const { containerRef, registerItem } = useAutoScroll(documentId, (id) => console.log(`${id} in the view!!`))

    const style: React.CSSProperties = useMemo(() => height ? ({
        maxHeight: `${height}px`
    }) : {}, [height])

    return (
        <div
            className={`overflow-y-scroll w-full p-3`} 
            style={style}
            ref={containerRef}
        >
            <ul className="w-full">
                {noteIds && noteIds.map((id, idx) => (
                    <ListItem 
                        key={id} 
                        id={id} 
                        idx={idx} 
                        refFn={registerItem(id)}
                        data-id={id}
                    /> 
                ))} 
            </ul>
        </div>
    )

}