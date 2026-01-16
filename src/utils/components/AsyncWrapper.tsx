import { useEffect, useState, type FC, type PropsWithChildren } from "react";

export interface AsyncWrapperProps {
    fn: () => Promise<void>
}

export const AsyncWrapper: FC<PropsWithChildren<AsyncWrapperProps>> = ({children, fn}) => {

    const [isReady, setIsReady] = useState(false)
    const [error, setError] = useState<null | string>(null)

    useEffect(() => {
        fn().then(() => {
            setIsReady(true)
        }).catch(() => {
            setError("Error occurred")
        })
    }, [])

    if(error){
        return <div>{error}</div>
    }

    if(!isReady){
        return <div>Not ready yet...</div>
    }

    return <>{children}</>
}