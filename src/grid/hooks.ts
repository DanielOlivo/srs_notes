import { useEffect, useState } from "react"

export const useOpeningHook = (lastOpeningTimestamp?: number, openInterval?: number, skip?: boolean) => {

    const [isOpen, setIsOpen] = useState<boolean | null>(null);

    useEffect(() => {
        if (skip || !lastOpeningTimestamp || !openInterval) {
            return;
        }

        const remainingTime = lastOpeningTimestamp + openInterval - Date.now();
        let timeout: number | null = null 
        
        if(remainingTime > 0) {
            setTimeout(() => setIsOpen(true), 0);
            timeout = setTimeout(() => {
                setIsOpen(false);
            }, Math.max(0, remainingTime));
        }

        return () => {
            if(timeout) 
                clearTimeout(timeout);
        }
    }, [lastOpeningTimestamp, openInterval, skip]);

    if(skip){
        return { isOpen: false }
    }

    return { isOpen };
}