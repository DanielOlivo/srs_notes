import type { FC } from "react";
import { Outlet, useMatches, useOutletContext } from "react-router";

export const HeaderLayout: FC = () => {
    const region = useOutletContext()
    const matches = useMatches()

    const routeWithHeader = matches.find(m => (m.handle as { header?: FC })?.header)

    if(region === 'header'){
        const HeaderComponent = (routeWithHeader?.handle as {header?: FC })?.header
        return HeaderComponent ? <HeaderComponent /> : null
    }

    return <Outlet />
}