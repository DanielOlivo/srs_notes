import type { FC } from "react"
import { toZip } from "../csv"

export const DumpButton: FC = () => {
    return (
        <button 
            className="btn btn-info"
            onClick={toZip}
        >Dump</button>
    )
}
