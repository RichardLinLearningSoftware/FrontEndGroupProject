import { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { BrowserRouter,  Route, Routes, NavLink, useSearchParams} from 'react-router';
import { onAuthStateChanged, signOut  } from "firebase/auth";
import { GetAllData, GetSingleData } from './Content.jsx';
import { auth } from "../firebase.js";

const user = auth.currentUser;
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log("is logged in");
    console.log(user.email);
    // ...
  } else {
    console.log("not logged in");
    // User is signed out
    // ...
  }
});

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
            <h2>Login</h2>
            <form onSubmit={LoginUser}>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email"/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password"/>
                <button type="submit">Submit</button>
            </form>
            <button onClick={()=>signOut(auth)}>Logout</button>
        </>
    );
}

export {HomePage, ContactPage, TestPage, Register, Login}