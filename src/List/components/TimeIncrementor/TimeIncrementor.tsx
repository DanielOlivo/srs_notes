import { useIncrementTime } from "@list/hooks/incrTime";
import type { FC } from "react";

export const TimeIncrementor: FC = () => {

    useIncrementTime()

    return null
}