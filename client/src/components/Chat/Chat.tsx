import { useCallback, useContext, useEffect, useState } from "react";
import MessageInput from "../Message/MessageInput";
import MessageList from "../Message/MessageList";
import classes from "./Chat.module.css"
import { MessageType } from "../../Types/types"
import { SERVER_URL } from "../../consts";
import AuthContext from "../../store/auth-context";
const TIMEOUT = 5_000; // every 5 seconds

function Chat(props: { chatId: string }) {
    const authContext = useContext(AuthContext);
    const { chatId } = props;
    const [messages, setMessages] = useState<MessageType[]>([]);
    const fetchMessages = useCallback(() => {
        if (!chatId) return;
        fetch(`${SERVER_URL}/chats/${chatId}`)
            .then(response => response.json())
            .then(messages => setMessages(messages))
    }, [chatId])

    // fetch every `TIMEOUT` milliseconds messages 
    useEffect(() => {
        const interval = setInterval(() => {
            fetchMessages()
        }, TIMEOUT);

        // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
        return () => clearInterval(interval);
    }, [chatId, fetchMessages]);


    const onNewMessage = (message: string) => {
        const date = new Date();
        const newMessage: MessageType = { ownerId: authContext.id, message, date: date.toISOString() }

        fetch(`${SERVER_URL}/chats/${chatId}`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessage),
            })
        setMessages((prevMessages) => [...prevMessages, newMessage])
    }
    console.log(messages);

    return (
        <section className={classes.chat}>
            <header>
                Chat
            </header>
            <main>
                <MessageList messages={messages} />
            </main>
            <MessageInput onNewMessage={onNewMessage} />
        </section>
    )
}

export default Chat;