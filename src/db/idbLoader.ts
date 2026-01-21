import type { Preview } from '@storybook/react-vite'
import { proceedParams, type IdbParams } from "./decorator"

type ExtractLoader<T> = T extends (infer U)[] ? U : T
type Loader = ExtractLoader<NonNullable<Preview["loaders"]>>
type Context = Parameters<Loader>[0]

export const idbLoader: Loader = async (context: Context) => {

    const { idb } = context.parameters

    await proceedParams(idb as IdbParams) 
}