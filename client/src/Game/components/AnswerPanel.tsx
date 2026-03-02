import type { FC } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectIsOnAnswer } from "../game.selectors";
import { useAnswerRequestMutation } from "../../words/words.api";

export const AnswerPanel: FC = () => {

    const isOnAnswer = useAppSelector(selectIsOnAnswer)

    const [sendAnswer, { isLoading, isError, data}] = useAnswerRequestMutation();

    /*
    
    */

    if(!isOnAnswer) return null;



    return (
        <div>
            <button className="btn btn-error">Bad</button>
            <button>Hard</button>
            <button>Good</button>
            <button>Easy</button>
        </div>
    );
}