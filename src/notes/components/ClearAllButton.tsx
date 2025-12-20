import type { FC } from "react";
import { getDb } from "../../db/LocalDb";

export const ClearAllButton: FC = () => {

    const handleClick = async () => {
        console.log("clearing db...")
        const db = await getDb() 
        await db.clear();
        console.log('...done');
        window.location.reload();
    }

    return <button onClick={handleClick}>Clear all</button>
}