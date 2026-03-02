import type { FC } from "react";
import { CleanAllButton } from "../../../db/components/CleanAll";
import { TestButton } from "../../../db/components/TestButton";
import { SeedButton } from "../../../db/components/SeedButton";

export const Development: FC = () => {
    return (
        <div className="grid grid-cols-[80%_20%] gap-y-2">

            <div>
                <span>clean db</span>
            </div>

            <div>
                <CleanAllButton />
            </div>

            <div>
                <p className="text-sm">Seed db with fake data</p>
            </div>

            <div>
                <SeedButton />
            </div>

            <div>
                <span className="text-sm">Test db opearations</span>
            </div>

            <div>
                <TestButton />
            </div>

        </div>
    )
}