import { Decorator } from "@storybook/react";

export const withLayout: Decorator = (Story, context) => {

    const { classNames } = context.parameters 

    return (
        <div className={classNames}>
            <Story />
        </div>
    )
}