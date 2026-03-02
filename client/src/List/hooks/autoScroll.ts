import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react"
import { useGetDocumentScrollPositionQuery, useSetDocumentScrollPositionMutation } from "../../documents/document.api"
import { useDebounce } from "../../common/hooks/useDebounce"

export const useAutoScroll = (docId: string) => {
    
    const { run } = useDebounce(1000)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const items = useRef(new Map<string, HTMLElement>())

    // why keeping all the id?
    const observerRef = useRef<IntersectionObserver | null>(null)


    const registerItem = useCallback((id: string) => (el: HTMLElement | null) => {
        if(!el){
            // items.current.delete(id)
            return
        }
        items.current.set(id, el)
        observerRef.current?.observe(el)
        // console.log(`added ${id} to items`)
    }, [])


    const [done, _setDone] = useState(false)
    const setDone = useEffectEvent(() => _setDone(true))
    const [setScrollPos, ] = useSetDocumentScrollPositionMutation()

    const { data: noteId } = useGetDocumentScrollPositionQuery(docId)

    // control scroll
    useEffect(() => {
        if(noteId && !done){
            const el = items.current.get(noteId)
            if(el){
                el.scrollIntoView({block: 'center'})
            }
            setDone()
        }
    }, [done, noteId])

    // observe

    useEffect(() => {
        if(!containerRef.current) return
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    const id = entry.target.getAttribute("data-id")
                    if(id){
                        run(() => {
                            console.log("setting scroll pos")
                            setScrollPos({
                                id: docId,
                                noteId: id
                            })
                        })
                    }
                }
            })
        }, {
            root: containerRef.current,
            threshold: 0.2
        })
        observerRef.current = observer

        items.current.forEach(el => observer.observe(el))
        console.log('observer is running...')

        return () => {
            observer.disconnect()
        }
    }, [])

    return {
        containerRef,
        registerItem
    }
}