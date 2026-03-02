import type { FC } from "react";
import type { TwoSide as TwoSideType } from "../../utils/TwoSide";
import { useGetWordByIdQuery } from "../../words/words.api";

export const TwoSide: FC<TwoSideType> = ({id, front, back, lastAnswerTimestamp, memInterval}) => {

    const { data, isLoading, isError } = useGetWordByIdQuery(id);
    /*
        shows back if current timestamp < lastAnswerTimestamp + memInterval
        otherwise shows front- 

        background color - find solution (green -> yellow -> red)

        case for loading

        case for data === undefined || isError

        default case
    */

    return null;
}