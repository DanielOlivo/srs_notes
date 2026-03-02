import { type FC } from "react";
import { useDarkThemeSetter } from "../../../theme/useTheme";

export const Settings: FC = () => {

    const { setDark, isDark } = useDarkThemeSetter()

    return (
        <div className="grid grid-cols-[80%_20%]">

            <div>
                <span>theme</span>
            </div>

            <div>
                <input
                    type="checkbox"
                    className="toggle theme-controller"
                    value='dark'
                    onChange={setDark}
                    checked={isDark}
                />
            </div>

        </div>
    ) 
}