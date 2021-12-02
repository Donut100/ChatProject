import { useContext, useEffect, useState } from "react";
import Chat from "../Chat/Chat";
import ChatList from "../Chat/ChatList";
import Card from "../UI/Card";
import classes from "./MainPage.module.css"
import { ChatDetails } from "../../Types/types"
import LoginForm from "../LoginForm";
import AuthContext from "../../store/auth-context";

function MainPage() {
    const authContext = useContext(AuthContext);
    const { id, isLoggedIn } = authContext;
    const [chatId, setChatId] = useState<string>("");
    const [chats, setChats] = useState<ChatDetails[]>([]);

    useEffect(() => {
        console.log("fetch chats", id)
        if (id) {
            fetch("http://localhost:8080/chats")
                .then(response => response.json())
                .then(chats => setChats(chats));
        }
    }, [id])
    return (
        <Card className={classes.card}>
            {!isLoggedIn && <LoginForm isLogin={true} />}
            {isLoggedIn && <ChatList onItemClick={setChatId} chats={chats} />}
            {isLoggedIn && <Chat chatId={chatId} />}
        </Card>
    )
}

export default MainPage;