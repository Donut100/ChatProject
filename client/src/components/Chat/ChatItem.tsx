import classes from "./ChatItem.module.css"

type ExpectedArguments = {
    id: number,
    onItemClick: Function,
    name: String,
    lastMessage: {
        message: string,
        date: string,
    },
    isSelected: Boolean,
}

function ChatItem(props: ExpectedArguments) {
    const onClick = () => {
        props.onItemClick(props.id);
    }
    const { message: lastMessage, date: dateString } = props.lastMessage;
    const messageDate = new Date(dateString);
    const time = `${messageDate.getHours()}:${messageDate.getMinutes()}`
    return (
        <li onClick={onClick} className={props.isSelected ? classes.selected : ""}>
            <div >
                <span className={classes.header}>{props.name}</span>
                <span className={classes.timestamp}>{time}</span>
            </div>
            <span className={classes.body}>{lastMessage}</span>
        </li >
    )
}

export default ChatItem;