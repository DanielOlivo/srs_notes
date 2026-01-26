import type { FC } from "react";
import { getDb } from "../LocalDb";

const cleanAll = async () => {
    console.log('cleanAll...')
    const db = await getDb()
    await db.clear()
    console.log('...cleanAll done')
}

export const CleanAllButton: FC = () => {
    return (
        <button
            className="btn btn-warning"
            onClick={cleanAll} 
        >Clean All</button>
    )
}