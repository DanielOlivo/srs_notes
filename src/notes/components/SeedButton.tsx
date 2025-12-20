import type { FC } from "react";
import { seed } from "../../db/seed";


export const SeedButton: FC = () => {

    const handleClick = async () => {
        try{
            console.log('seeding...')
            await seed()
            console.log('...done')
            window.location.reload()
        }
        catch(error){
            console.error(error)
        }
    }

    return <button onClick={handleClick}>Seed</button>
}