import type { FC } from "react";

interface UpdateButton {
    disabled?: boolean
    onClick?: () => void
    title?: string
}

export const UpdateButton: FC<UpdateButton> = ({title = "Update", disabled, onClick}) => {
    return <button 
        disabled={disabled !== undefined ? disabled : false}
        type="button"
        onClick={onClick}
        className="btn btn-primary"
    >{title}</button>
}