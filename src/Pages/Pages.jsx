import { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { BrowserRouter,  Route, Routes, NavLink, useSearchParams, redirect, useNavigate } from 'react-router';
import { onAuthStateChanged, signOut  } from "firebase/auth";
import { GetAllData, GetSingleData, GetUserProfile } from './Content.jsx';
import { collection, doc, getDoc, getDocs, getFirestore, where, addDoc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";

function NotFound(){
    const navigate = useNavigate();
    return(
        <>
            <h2>Page not found</h2>
            <p>This page doesnt exist try something else bruh</p>
            <button onClick={() => navigate("/")}>Go to homepage</button>
        </>
    )
}

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
        <>
            <h2>Contact page</h2>
            <p>Lorem ipsum or somthing</p>
        </>
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
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const authUser = auth.currentUser;
    useEffect(() => {
        onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
        });
    }, []);

    async function RegisterUser(e) {
        e.preventDefault();
        if(password.length >= 6 && username.length >= 3){
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
                if(error.code == "auth/invalid-email"){
                    setError("Invalid email");
                }else if(error.code == "auth/email-already-in-use"){
                    setError("Email is already in use");
                }else{
                    setError(error.code);
                }
            }
        }else{
            if(password.length < 6){
                setError("Password must be 6 characters long or longer");
            }else if(username.length < 3){
                setError("Username must be 3 characters or longer");
            }else{
                setError("Unknown error");
            }
        }
    }
    
    if(!user){
        return (
            <>
                <h2>Register</h2>
                <form onSubmit={RegisterUser}>
                    <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder="email"/>
                    <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder="username"/>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="password"/>
                    <h3>{error}</h3>
                    <button type="submit">Submit</button>
                </form>
            </>
        );
    }else{
        return (
            <>
                <h2>You are already logged in</h2>
                <p>Log out to create a acount</p>
            </>
        );
    }
}

function Login(){
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const authUser = auth.currentUser;
    useEffect(() => {
        onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
        });
    }, []);

    async function LoginUser(e) {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword( auth, email, password);
            console.log(userCredential.user);
            navigate("/");
        } catch (error) {
            console.log(error.code);
            console.log(error.message);
            if(error.code == "auth/invalid-email"){
                setError("Invalid email");
            }else if(error.code == "auth/missing-password"){
                setError("Invalid password");
            }else if(error.code == "auth/invalid-credential"){
                setError("Wrong email or password");
            }else if( error.code == "auth/too-many-requests"){
                setError("To many login attempts");
            }else{
                setError(error.code);
            }
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
                    <h3>{error}</h3>
                    <button type="submit">Submit</button>
                </form>
            }
        </>
    );
}

function Profile(){
    const [param] = useSearchParams();
    return(
        <GetUserProfile userId = {param.get("id")}/>
    );
}

function CreatePost(){
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [user, setUser] = useState(null);
    const authUser = auth.currentUser;
    useEffect(() => {
        onAuthStateChanged(auth, async (authUser) => {
            if(authUser != null){
                const docSnap = await getDoc(doc(db, "Users", authUser.uid));
                if(docSnap.exists()){
                    setUser(docSnap);
                }
            }
        });
    }, []);

    if(user){
        async function CreatePost(e) {
            e.preventDefault();
            addDoc(collection(db, "Posts"), {
                user: user.data().name,
                uid: authUser.uid,
                title: title,
                description: desc
            });
            navigate("/");
        }

        return(
            <>
                <form onSubmit={CreatePost}>
                    <input type="text" onChange={(e) => setTitle(e.target.value)} placeholder="Title" required/>
                    <textarea onChange={(e) => setDesc(e.target.value)} placeholder="Description"></textarea>
                    <button type="submit">Submit</button>
                </form>
            </>
        );
    }else{
        return(
            <>
                <h2>Pls login to create post</h2>
                <p>This page cannot be used bruh</p>
                <button onClick={() => navigate("/login")}>Login</button>
                <button onClick={() => navigate("/register")}>Register</button>
            </>
        )
    }
}

export {HomePage, ContactPage, TestPage, Register, Login, Profile, NotFound, CreatePost}