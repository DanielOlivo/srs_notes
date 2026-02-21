import { useMemo, type FC } from "react";
import { ListItem } from "./ListItem";
import { useGetDocNotesQuery } from "../../notes/note.api";
import { useAutoScroll } from "../hooks/autoScroll";
import { Virtuoso } from "react-virtuoso";
import { useGetDocumentScrollPositionQuery, useSetDocumentScrollPositionMutation } from "../../documents/document.api";

export interface ListProps {
    documentId: string
    height?: number // px
}

export const List: FC<ListProps> = ({documentId, height}) => {

    const { data: noteIds } = useGetDocNotesQuery(documentId)
    const [ setScrollPos, ] = useSetDocumentScrollPositionMutation()
    const { data: initIdx } = useGetDocumentScrollPositionQuery(documentId)

    const { containerRef, registerItem } = useAutoScroll(documentId)

    const style: React.CSSProperties = useMemo(() => height ? ({
        maxHeight: `${height}px`
    }) : {}, [height])

    return (
        <Virtuoso
            // className="max-h-screen"
            style={{
                // height:'300px',
                height:'90vh',
                width: "300px"
            }}
            data={noteIds}
            itemContent={(idx, id) => (
                <ListItem
                    key={id} 
                    id={id}
                    idx={idx}
                    refFn={() => {}}
                />
            )}
            initialTopMostItemIndex={initIdx ?? 0}
            rangeChanged={(range) => {
                setScrollPos({
                    id: documentId,
                    idx: range.startIndex
                })
            }}
        />
    )

    return (
        <div
            className={`max-h-full overflow-y-scroll w-full p-3`} 
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