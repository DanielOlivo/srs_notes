import { useEffect, useState, type FC } from "react";
import { useAppDispatch } from "../app/hooks";
import { clearWords, loadWords } from "./words.thunks";
import { useLazyGetWordsQuery } from "./words.api";



export const WordList: FC = () => {

    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState("")

    const [getWords, {data, isError: isGetWordsError}] = useLazyGetWordsQuery();

    const handleLoad = async () => {
        console.log("loading")
        await dispatch(loadWords())
    } 

    const handleClear = async () => {
        console.log("clearing...")
        await dispatch(clearWords());
    }

    useEffect(() => {
        // console.log('updating searchTerm', searchTerm)
        getWords({term: searchTerm});
    }, [searchTerm, getWords])

    return (
        <div
            className="w-full h-full flex flex-col items-stretch justify-start" 
        >
            <div
                className="w-full flex flex-row justify-between items-center" 
            >
                <button onClick={handleLoad}>Load</button>
                <button onClick={handleClear}>Clear</button>
            </div>

            <div>
                <input
                    type="text"
                    className="w-full border border-slate-400"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>


            {isGetWordsError && <div>{isGetWordsError}</div>}

            <ul>
                {data && data.map(r => (
                    <li key={r.id}>{r.value}</li>
                ))}
            </ul>
        </div>
    )
}