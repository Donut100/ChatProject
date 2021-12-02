import { FormEvent, FormEventHandler, MouseEventHandler, useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../store/auth-context";
import classes from "./LoginForm.module.css"
import Card from "./UI/Card";
function LoginForm(props: { isLogin: boolean }) {
    const authContext = useContext(AuthContext);
    const { login } = authContext;
    const [isLogin, setIsLogin] = useState<boolean>(props.isLogin);
    const [valid, setValid] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const nameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const title = isLogin ? "Login" : "SignUp";

    useEffect(() => {
        if (!valid) return;

        const name = nameRef.current!.value.trim();
        const password = passwordRef.current!.value.trim();

        fetch(`http://localhost:8080/${title}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, password })
        })
            .then(async response => {
                if (!response.ok) {
                    throw await response.json();
                }
                console.log(response.headers.get('Set-Cookie'));

                return response.json();
            })
            .then(data => login(data.id))
            .catch(err => setError(err.message));
        setValid(false);
    }, [valid, login, title])

    const onSubmitHandler: FormEventHandler = (e: FormEvent<Element>) => {
        e.preventDefault();
        let name = nameRef.current!.value.trim();
        let password = passwordRef.current!.value.trim();
        if (name.length === 0 || password.length === 0) {
            setError("Fields cannot be empty!")
            setValid(false);
        }
        else {
            setError("");
            setValid(true);
        }
    }

    const onClickHandler: MouseEventHandler<HTMLButtonElement> = (event) => {
        if (event.currentTarget.className !== "") return;
        setIsLogin((prev) => !prev)
    }
    return (
        <Card className={classes.view}>
            <h1 className={classes.title}>{title}</h1>
            <nav>
                <button className={isLogin ? classes.clicked : ""} onClick={onClickHandler}>Login</button>
                <button className={isLogin ? "" : classes.clicked} onClick={onClickHandler}>Sign Up</button>
            </nav>
            <form onSubmit={onSubmitHandler}>
                <label htmlFor="name" className={classes.label}>Name</label>
                <input id="name" type="text" ref={nameRef} className={classes.input} />

                <label htmlFor="password" className={classes.label}>Password</label>
                <input id="password" type="password" ref={passwordRef} className={classes.input} />
                <div className={`${classes.container} ${error ? "" : classes.invisible}`}>
                    {error || `${error ? "" : classes.invisible}`}
                </div>
                <button className={classes.btn}>{title}</button>
            </form >
        </Card>
    )
};
export default LoginForm;