import React, { useState } from "react";

// const calcRemainingTime = (experationTime) => {
//     const currentTime = new Date().getTime();
//     return experationTime - currentTime;
// }
const AuthContext = React.createContext(
    {
        id: "",
        isLoggedIn: false,
        login: (id) => { },
        logout: () => { },
    }
)

export const AuthContextProvider = (props) => {
    let logoutTimer;
    const initialToken = localStorage.getItem('id')
    const [id, setId] = useState(initialToken);
    const isLoggedIn = !!id;

    const logoutHandler = () => {
        localStorage.clear()
        if (logoutTimer) {
            clearTimeout(logoutTimer)
        }
        setId(null)
    };

    const loginHandler = (id) => {
        // localStorage.setItem('id', id);
        setId(id)
    };

    const contextValue = {
        id,
        isLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return <AuthContext.Provider value={contextValue} log>{props.children}</AuthContext.Provider>
}

export default AuthContext;