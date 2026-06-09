import { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { BrowserRouter,  Route, Routes, NavLink, useSearchParams} from 'react-router';
import { onAuthStateChanged, signOut  } from "firebase/auth";
import { GetAllData, GetSingleData } from './Content.jsx';
import { auth } from "../firebase.js";

function HomePage(){
    return(
        <>
            <h2>Home page</h2>
            <GetAllData/>
        </>
    );
}

function ContactPage(){
    return(
        <h2>Contact page</h2>
    );
}

function TestPage(){
    const [param] = useSearchParams();
    return(
        <GetSingleData documentName = {param.get("id")}/>
    );
}

function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function RegisterUser(e) {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword( auth, email, password);
            console.log(userCredential.user);
        } catch (error) {
            console.log(error.code);
            console.log(error.message);
        }
    }
    
    return (
        <>
            <h2>Register</h2>
            <form onSubmit={RegisterUser}>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email"/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password"/>
                <button type="submit">Submit</button>
            </form>
        </>
    );
}

function Login(){
    const [user, setUser] = useState(null);
    const authUser = auth.currentUser;
    useEffect(() => {
        onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
        });
    }, []);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function LoginUser(e) {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword( auth, email, password);
            console.log(userCredential.user);
        } catch (error) {
            console.log(error.code);
            console.log(error.message);
        }
    }
    
    return (
        <>
            <h2>{user ? "Logout" : "Login"}</h2>
            {user ?
                <button onClick={()=>signOut(auth)}>Logout</button>
            :
                <form onSubmit={LoginUser}>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email"/>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password"/>
                    <button type="submit">Submit</button>
                </form>
            }
        </>
    );
}

export {HomePage, ContactPage, TestPage, Register, Login}