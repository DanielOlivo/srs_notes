import type { FC, PropsWithChildren } from "react"
import { SimpleGridContext, useSimpleGrid } from "./useSimpleGrid"
import { GridView } from "./components/GridView"
import { GridControl } from "./components/GridControl"

export const SimpleGrid: FC<PropsWithChildren> = ({children}) => {

    const gridHook = useSimpleGrid({x: 5, y: 5})

    return (
        <SimpleGridContext.Provider value={gridHook}>
            <div className="w-full h-full flex flex-row justify-between items-center">
                <GridView />
                <GridControl />
            </div>
        </SimpleGridContext.Provider>
    )
}