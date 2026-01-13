import type { FC } from "react";
import type { GridState } from "./useGrid";
import { Vector2 } from "../../../utils/Coord";

export const StateDisplay: FC<GridState> = (state) => {
    return (
        <div className="absolute text-slate-500">
            <table>
                <tbody>
                    <tr>
                        <th>position1</th>
                        <td>{Vector2.from(state.position1).toString()}</td>
                    </tr>
                    <tr>
                        <th>position2</th>
                        <td>{Vector2.from(state.position2).toString()}</td>
                    </tr>

                    <tr>
                        <th>isMouseDown</th>
                        <td>{state.isMouseDown ? "true" : "false"}</td>
                    </tr>

                    <tr>
                        <th>isPanning</th>
                        <td>{state.isPanning ? "true" : "false"}</td>
                    </tr>

                    <tr>
                        <th>startDrag</th>
                        <td>{Vector2.from(state.startDrag).toString()}</td>
                    </tr>

                    <tr>
                        <th>client</th>
                        <td>{Vector2.from(state.client).toString()}</td>
                    </tr>

                    <tr>
                        <th>overCoord</th>
                        <td>{Vector2.from(state.overCoord).toString()}</td>
                    </tr>

                    <tr>
                        <th>overHandler</th>
                        <td>{state.overHandler === null ? 'null' : Vector2.from(state.overHandler).toString()}</td>
                    </tr>

                    <tr>
                        <th>dragging</th>
                        <th>{state.dragging ? Vector2.from(state.dragging).toString() : 'null'}</th>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}