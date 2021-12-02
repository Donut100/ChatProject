import classes from "./MessageList.module.css"
import Message from "./Message";
import { MessageType } from "../../Types/types";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";
function MessageList(props: { messages: MessageType[] }) {
    const { id: ownerId } = useContext(AuthContext);

    const messages = [];
    for (const message of props.messages) {
        messages.push(<Message classes={classes} isMe={message.ownerId === ownerId} message={message.message} />)
    }
    return (
        <ul className={classes.chat}>
            {
                messages
            }
        </ul>
    )
}
export default MessageList;