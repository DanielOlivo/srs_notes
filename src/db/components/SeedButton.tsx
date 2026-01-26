import type { FC } from "react";
import { useSeedMutation } from "../../documents/document.api";

export const SeedButton: FC = () => {

    const [ seed, ] = useSeedMutation()

    return (
        <button
            className="btn btn-accent" 
            onClick={() => seed()}
        >Seed</button>
    )
}