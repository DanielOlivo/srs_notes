import type { FC } from "react";
import { NotImplemented } from "../../utils/NotImplemented";

export const DumpButton: FC = () => {

    const handleClick = () => {
        throw new NotImplemented();
    }

    return <button onClick={handleClick}>Dump</button>
}