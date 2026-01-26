import { Decorator } from "@storybook/react";

export const withLayout: Decorator = (Story, context) => {

    const { classNames, styles } = context.parameters 

    return (
        <div className={classNames} style={styles}>
            <Story />
        </div>
    )
}