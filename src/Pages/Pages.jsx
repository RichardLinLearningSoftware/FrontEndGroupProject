import { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { BrowserRouter,  Route, Routes, NavLink, useSearchParams, redirect, useNavigate } from 'react-router';
import { onAuthStateChanged, signOut  } from "firebase/auth";
import { GetAllData, GetSingleData } from './Content.jsx';
import { collection, doc, getDoc, getDocs, getFirestore, where, addDoc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";

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
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function RegisterUser(e) {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword( auth, email, password);
            console.log(userCredential.user.uid);

            await setDoc(doc(db, "Users", userCredential.user.uid), {
                    name: username,
                    bio: "Hello i'm " + username
            });
            navigate("/");
        } catch (error) {
            console.log(error.code);
            console.log(error.message);
        }
    }
    
    return (
        <>
            <h2>Register</h2>
            <form onSubmit={RegisterUser}>
                <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder="email"/>
                <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder="username"/>
                <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="password"/>
                <button type="submit">Submit</button>
            </form>
        </>
    );
}

function Login(){
    const navigate = useNavigate();
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
            navigate("/");
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

function Profile(){
    const [param] = useSearchParams();
    return(
        <div>{param.get("id")}</div>
    );
}

export {HomePage, ContactPage, TestPage, Register, Login, Profile}