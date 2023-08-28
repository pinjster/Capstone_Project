import { FormEvent, useContext, useRef, useState } from "react";
import { UserContext } from "../contexts/UserProvider";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";

function SignInForm() {

    const baseURL = import.meta.env.VITE_APP_BASE_API;

    const { setUser } = useContext(UserContext);
    const { authSignIn } = useContext(AuthContext);

    const emailField = useRef<HTMLInputElement>(null);
    const usernameField = useRef<HTMLInputElement>(null);
    const passwordField = useRef<HTMLInputElement>(null);

    const [ errorMessage, setErrorMessage ] = useState('');
    const nav = useNavigate();



    async function handleSignIn(e: FormEvent){
        e.preventDefault();
        setErrorMessage('');
        try {
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
                await authSignIn(emailField.current!.value, passwordField.current!.value);
                establishUser(usernameField.current!.value, data.access_token);
                resetFields();
                nav('/my-profile');
            }else if (response.status === 409){
                setErrorMessage(response.statusText);
            } else {
                setErrorMessage('Username already in use');
        }
        } catch (e) {
            if(typeof e === 'string'){
                setErrorMessage(e);
            } else {
                setErrorMessage('Invalid username or password');
            }
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
        emailField.current!.value = '';
        passwordField.current!.value = '';
        emailField.current!.value = '';
    }

    return (
        <form onSubmit={handleSignIn} className="auth-form">
            <h3>Sign in here!</h3>
            <p>Don't have an account? Sign up <NavLink to={'/sign-up'} className='sign-link'>here</NavLink></p>
            <p className="error">{errorMessage}</p>
            <label >Username:</label>
            <input type="text" ref={usernameField} placeholder="Username" required/>
            <label >Email:</label>
            <input type="email" ref={emailField} placeholder="Email" required/>
            <label >Password:</label>
            <input type="password" ref={passwordField} placeholder="Password" required/>
            <label >{ errorMessage }</label>
            <input type="submit" value="Sign In" className="auth-submit-btn" />
        </form>
  )
}

export default SignInForm;