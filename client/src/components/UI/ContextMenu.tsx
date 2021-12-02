import { MouseEventHandler, useState } from "react"
type ExpectedArguments = {
    items: {
        text: string,
        onClick: MouseEventHandler<HTMLLIElement>,
    }[]
}
function ContextMenu(props: ExpectedArguments) {
    // Show or hide the custom context menu
    const [isShown, setIsShown] = useState(false);

    // The position of the custom context menu
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // Show the custom context menu
    const showContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        // Disable the default context menu
        event.preventDefault();

        setIsShown(false);
        const newPosition = {
            x: event.pageX,
            y: event.pageY,
        };

        setPosition(newPosition);
        setIsShown(true);
    };

    // Hide the custom context menu
    const hideContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsShown(false);
    };
    return (
        <div
            onClick={hideContextMenu}
        >
            <ul>
                {
                    props.items.map(ele => <li onClick={ele.onClick}>{ele.text}</li>)
                }
            </ul>
        </div>
    );
}

export default ContextMenu;