import React, { createContext, useState } from "react";
import { useEffect } from "react";

const {
    authenticateUserLogin_EndPoint_APICall_POST,
    // retrieveCurrentSessionLoginUsername_APICall_GET,
} = require("../common/backendAPICalls");

// @ts-ignore
export const AuthLogin = createContext();

const AuthLoginProvider = (props) => {
    const [currentUser, setCurrentUser] = useState(null);

    /* upon successful login, save the generated jwt token attached to this username,userID to localstorage auth key and set currentUser state 
    clear localstorage auth key and current user state upon failed login*/
    const authenicateUserLogin = async (username, password) => {
        // check database with login credential

        const response = await authenticateUserLogin_EndPoint_APICall_POST(username, password);

        const loginStatus =
            response.status === 200
                ? await response.json()
                : {
                      authenticateStatus: false,
                      message: "Error Connecting to Server. Unable to authenticate login.",
                  };

        if (loginStatus.authenticateStatus) {
            sessionStorage.setItem("authToken", loginStatus.jwt);
            setCurrentUser(username);
        } else {
            sessionStorage.clear();
            setCurrentUser(null);
        }
        alert(loginStatus.message);
        return loginStatus.authenticateStatus;
    };

    /* clear localstorage auth key which stores jwt token and set currentuser state to null upon logout, if action parameter is 
  logout = 'logout' --> logout trigger by clicking logout button. if action =''403'--> trigger by status 403 (session timeout) */
    const handleUserLoggedOut = (action) => {
        // no user already logged in, skip rest of function
        if (!sessionStorage.getItem("authToken")) return;

        // parameter action - action = 'logout' when logout button is clicked
        if (action === "403") {
            alert("Session timeout... Please Login Again");
        }
        localStorage.clear();
        setCurrentUser(null);
    };

    /* check in any user is logged in, if auth token is present in localstorage, user is logged in */
    const isUserLoggedIn = () => {
        if (localStorage.getItem("authToken")) return true;
        else return false;
    };

    return (
        <AuthLogin.Provider
            value={{
                currentUser,
                handleUserLoggedOut,
                authenicateUserLogin,
                isUserLoggedIn,
            }}
        >
            {props.children}
        </AuthLogin.Provider>
    );
};

export default AuthLoginProvider;
