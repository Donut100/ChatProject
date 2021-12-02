import { useRef } from "react";
import classes from "./MessageInput.module.css"

const MAX_INPUT_LENGTH = 100;

function MessageInput(props: { onNewMessage: Function }) {
    const input = useRef<HTMLTextAreaElement>(null);
    const onSubmit = () => {
        let val = input.current!.value.trim();

        // check if a user actually entered character not including whitespaces, tabs and so on...
        if (!val) return;
        if (val.length > MAX_INPUT_LENGTH) return;
        input.current!.value = "";
        props.onNewMessage(val)
    }
    return (
        <div>
            <textarea maxLength={MAX_INPUT_LENGTH} className={classes.input} ref={input} />
            <button className={classes.submit} onClick={onSubmit}>Send</button>
        </div>
    )
}

export default MessageInput;