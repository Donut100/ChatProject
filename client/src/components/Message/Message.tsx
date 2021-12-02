import { MouseEventHandler } from "react";

function Message(props: { isMe: Boolean, classes: { readonly [key: string]: string }, message: string }) {

    const contextMenuHandler: MouseEventHandler<HTMLLIElement> = (e) => {
        e.preventDefault();
        return (<ul style={{ position: 'absolute', top: `${e.clientY}px`, left: `${e.clientX + 5}px` }}>
            <li>delete</li>

        </ul>);
    }

    const from = `${props.classes["chat-item"]} ${props.isMe ? props.classes["from-me"] : props.classes["from-them"]}`
    return (
        <li className={from} onContextMenu={contextMenuHandler}>
            {props.message}
        </li>
    )
}

export default Message;