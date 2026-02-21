import type { FC } from "react";
import { useParams } from "react-router";
import { HeaderElements } from "../../../common/components/HeaderElements";

export const DocumentEditHeaderElements: FC = () => {
    const { docId: id } = useParams<{docId: string}>()

    return (
        <HeaderElements 
            buttonType="back"
            title={id ? "Edit document" : "Create document"}
        />
    )

}