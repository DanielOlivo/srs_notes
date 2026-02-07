import type { FC } from "react";

export const Settings: FC = () => {
    return (
        <div className="grid grid-cols-[80%_20%]">

            <div>
                <span>theme</span>
            </div>

            <div>
                <input
                    type="checkbox"
                    value="dark"
                    className="toggle theme-controller"
                />
            </div>

        </div>
    ) 
}