import { useState } from "react"
import ChatItem from "./ChatItem"
import classes from './ChatList.module.css'
import { ChatDetails } from "../../Types/types"

type ExpectedArguments = {
    onItemClick: Function,
    chats: ChatDetails[]
}

function ChatList(props: ExpectedArguments) {
    const [selected, setSelected] = useState<number>(-1);

    const onItemClick = (chatId: number) => {
        props.onItemClick(chatId);
        setSelected(chatId);
    }

    return (
        <ul className={classes.products}>
            {props.chats.map((chat) => <ChatItem key={chat.id} {...chat} onItemClick={onItemClick} isSelected={chat.id === selected} />)}
        </ul>
    )
}

export default ChatList