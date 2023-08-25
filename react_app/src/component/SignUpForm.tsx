import { FormEvent, useContext, useRef, useState } from "react";
import { UserContext } from "../contexts/UserProvider";
import { NavLink, useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthProvider";

function SignUpForm() {
    
    const { setUser } = useContext(UserContext);
    const { authSignUp } = useContext(AuthContext)

    const usernameField = useRef<HTMLInputElement>(null);
    const emailField = useRef<HTMLInputElement>(null);
    const passwordField = useRef<HTMLInputElement>(null);

    const [ errorMessage, setErrorMessage ] = useState('');
    const nav = useNavigate()

    const baseURL = import.meta.env.VITE_APP_BASE_API;


    async function handleSignIn(e: FormEvent){
        e.preventDefault();
        try {
            await authSignUp(emailField.current!.value, passwordField.current!.value)
            const response = await fetch(`${baseURL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: usernameField.current!.value,
                    email: emailField.current!.value,
                    password: passwordField.current!.value,
                })
            });
            if(response.ok){
                const data = await response.json();
                establishUser(usernameField.current!.value, data.access_token);
                resetFields();
                nav('/')
            }else if (response.status == 409){
                setErrorMessage(response.statusText);
            } else {
                setErrorMessage("Call failed");
            }
        } catch(e) {
            if(typeof e === 'string'){
                setErrorMessage(e);    
            } else {
                setErrorMessage('Invalid')
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
        usernameField.current!.value = '';
        passwordField.current!.value = '';
        emailField.current!.value = '';
    }

    return (
        <form onSubmit={handleSignIn} className="auth-form">
            <h3>Sign up here!</h3>
            <p>Already have an account? Sign in <NavLink to={'/sign-in'} className='sign-link'>here</NavLink></p>
            <p className="error">{ errorMessage }</p>
            <label >Username:</label>
            <input type="text" ref={usernameField} placeholder="Username" required />
            <label >Email:</label>
            <input type="text" ref={emailField} placeholder="Email" required  />
            <label >Password</label>
            <input type="password" ref={passwordField} placeholder="Password" required />
            <input type="submit" value="Sign Up" className="auth-submit-btn" />
        </form>
  )
}

export default SignUpForm;