import { useEffect, type FC } from "react";
import { useLazyGetConfigQuery } from "../../document.api";
import { useForm, type Path } from "react-hook-form";
import type { IDocumentConfig } from "../../../db/entities/documentConfig";
import { useParams } from "react-router";
import type { IDocId } from "../../document.defs";

/**todo */
export const DocumentConfig: FC = () => {

    const { docId } = useParams<{docId: string}>()
    // const { data: config } = useGetConfigQuery(docId)
    const [ getConfig, ] = useLazyGetConfigQuery()

    const {
        register,
        reset
    } = useForm<IDocumentConfig>()

    useEffect(() => {
        if(!docId) return
        getConfig(docId as IDocId).then(result => {
            if(!result.data) return
            reset(result.data) 
        })
    }, [docId])

    const getInput = (name: Path<IDocumentConfig>) => (
        <input
            {...register(name)}
            type="number"
        />
    )

    return (
        <form className="grid grid-cols-3">

            <div>
                Default interval
            </div>

            <div className="col-span-2">
                {getInput("defaultInterval")}
            </div>

            <div />

            <div>
                When is closed
            </div>

            <div>
                When is open
            </div>

            <div>Hard</div>
            <div>{getInput("multiplicatorOnClosed.hard")}</div>
            <div>{getInput("multiplicatorOnOpen.hard")}</div>

            <div>Good</div>
            <div>{getInput("multiplicatorOnClosed.good")}</div>
            <div>{getInput("multiplicatorOnOpen.good")}</div>

            <div>Easy</div>
            <div>{getInput("multiplicatorOnClosed.easy")}</div>
            <div>{getInput("multiplicatorOnOpen.easy")}</div>
        </form>
    )
}