import { FormEvent, useContext, useRef, useState } from "react";
import { UserContext } from "../contexts/UserProvider";
import { useNavigate } from "react-router-dom"

function SignInForm() {
    const { setUser } = useContext(UserContext);
    const usernameField = useRef<HTMLInputElement>(null);
    const passwordField = useRef<HTMLInputElement>(null);
    const [ errorMessage, setErrorMessage ] = useState('');
    const nav = useNavigate()

    const baseURL = import.meta.env.VITE_APP_BASE_API;


    async function handleSignIn(e: FormEvent){
        e.preventDefault();
        const response = await fetch(`${baseURL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameField.current!.value,
                password: passwordField.current!.value,
            })
        });
        if(response.ok){
            const data = await response.json();
            establishUser(usernameField.current!.value, data.access_token);
            resetFields();
            nav('/my-profile')
        }else if (response.status === 409){
            setErrorMessage(response.statusText),[errorMessage] // DOES NOT FUNCTION AS INTENDED
        } else {
            window.alert("Call failed");
        }
    }
  
    function establishUser(username: string, token: string){
        setUser({
            logged: true,
            username: username,
            accessToken: token
        });
        localStorage.setItem("localUser", JSON.stringify(username));
        localStorage.setItem("localToken", JSON.stringify(token));
    }

    function resetFields(){
        usernameField.current!.value = '';
        passwordField.current!.value = '';
    }

    return (
        <form onSubmit={handleSignIn} className="auth-form">
            <label >Username:</label>
            <input type="text" ref={usernameField} placeholder="Username" />
            <label >Password</label>
            <input type="password" ref={passwordField} placeholder="Password" />
            <label >{ errorMessage }</label>
            <input type="submit" value="Sign In" />
        </form>
  )
}

export default SignInForm;