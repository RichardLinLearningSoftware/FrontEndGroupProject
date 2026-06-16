import { collection, doc, getDoc, getDocs, getFirestore, where, addDoc, deleteDoc, updateDoc  } from "firebase/firestore";
import { firebaseConfig, app, db, auth } from "../firebase.js";
import { BrowserRouter,  Route, Routes, NavLink} from 'react-router';
import { onAuthStateChanged, signOut  } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { supabase } from "../supabase.js";

function GetAllData() {
  const [docs, setDocs] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "Posts"));
      setDocs(querySnapshot.docs);
    }
    fetchData();
  },[]);

  if (docs.length == 0) {
    return(
      <>
        <div className="test-container">
          <h2>No content yet</h2>
        </div>
      </>
    )
  }

  function RenderMedia(media){
    const type  = media.media.fileType;
    const mediaUrl = media.media.media;
    if(media){
      if(type?.startsWith("image/")){
        return (
          <img src={mediaUrl}/>
        );
      }

      if (type?.startsWith("video/")) {
        return (
            <video src={mediaUrl} controls/>
          );
      }

      if (type?.startsWith("audio/")) {
        return (
          <audio src={mediaUrl} controls/>
        );
      }
    }
  }

  return (
    <>
      {docs.map(doc =>
        <div className="test-container" key={doc.id}>
          <NavLink to={{pathname: "/post", search: `id=${doc.id}`,}}>
            <h2>title: {doc.data().title}</h2>
            <p>id: {doc.id}</p>
            <p>user: {doc.data().user}</p>
            <p>uid: {doc.data().uid}</p>
            <p>desc: {doc.data().description}</p>
          </NavLink>
          <RenderMedia media = {doc.data()}/>
        </div>
      )}
    </>
  );
}

function GetSingleData({ documentName }) {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [user, setUser] = useState(null);
  const authUser = auth.currentUser;
  useEffect(() => {
    async function fetchData() {
      onAuthStateChanged(auth, (authUser) => {
        setUser(authUser);
      });
      const docSnap = await getDoc(doc(db, "Posts", documentName));
      if(docSnap.exists()){
        setData(docSnap);
      }
    }
    fetchData();
  }, [documentName]);
  async function  DeletePost() {
      if (data.data().filePath) {
        await supabase.storage
          .from("MediaPost")
          .remove([data.data().filePath]);
      }
      await deleteDoc(doc(db, "Posts", documentName));
      setData(null);
  }

  function RenderMedia(media){
    const type  = media.media.fileType;
    const mediaUrl = media.media.media;
    if(media){
      if(type?.startsWith("image/")){
        return (
          <img src={mediaUrl}/>
        );
      }

      if (type?.startsWith("video/")) {
        return (
            <video src={mediaUrl} controls/>
          );
      }

      if (type?.startsWith("audio/")) {
        return (
          <audio src={mediaUrl} controls/>
        );
      }
    }
  }

  if (data) {
    if(user){
      return (
        <>
          <div className="test-container">
            <h2>title: {data.data().title}</h2>
            <p>id: {data.id}</p>
            <NavLink to={{pathname: "/user", search: `id=${data.data().uid}`,}} end>user: {data.data().user}</NavLink>
            <p>uid: {data.data().uid}</p>
            <p>desc: {data.data().description}</p>
            <RenderMedia media = {data.data()}/>
            {user.uid == data.data().uid && <button onClick={DeletePost}>Delete post</button>}
          </div>
        </>
      );
    }else{
      return (
        <>
          <div className="test-container">
            <h2>title: {data.data().title}</h2>
            <p>id: {data.id}</p>
            <NavLink to={{pathname: "/user", search: `id=${data.data().uid}`,}} end>user: {data.data().user}</NavLink>
            <p>uid: {data.data().uid}</p>
            <p>desc: {data.data().description}</p>
            <RenderMedia media = {data.data()}/>
          </div>
        </>
      );
    }
  }else{
    return(
      <>
        <div className="test-container">
            <h2>This post doesnt seem to exist</h2>
        </div>
      </>
    )
  }
}

function GetUserProfile({userId}) {
  if(userId == null){
    return(
      <>
        <div className="test-container">
            <h2>User doesnt seem to exist</h2>
        </div>
      </>
    )
  }
  const [userExits, setUserExits] = useState(false);
  const [bio, setBio] = useState("");
  const [user, setUser] = useState(null);
  const authUser = auth.currentUser;
  const [data, setData] = useState();
  useEffect(() => {
    async function fetchData() {
      onAuthStateChanged(auth, (authUser) => {
        setUser(authUser);
      });
      const docSnap = await getDoc(doc(db, "Users", userId));
      if(docSnap.exists()){
        setUserExits(true)
        setData(docSnap);
        setBio(docSnap.data().bio);
      }
    }
    fetchData();
  }, [userId]);

  async function UpdateProfile(e) {
    e.preventDefault();
    console.log("updated bio to: "+ bio);
    await updateDoc(doc(db, "Users", userId), { 
      bio: bio
    });
  }

  if(data && userExits){
    if(user && userId == user.uid){
      return (
        <>
          <div className="test-container">
            <h2>{data.data().name || "No name"}</h2>
            <p>{data.id}</p>
            <form onSubmit={UpdateProfile}>
              <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="About me"/>
              <button type="submit">Update profile</button>
            </form>
          </div>
        </>
      );
    }else{
      return (
        <>
          <div className="test-container">
            <h2>{data.data().name || "No name"}</h2>
            <p>{data.id}</p>
            <p>{data.data().bio || "No Description"}</p>
          </div>
        </>
      );
    }
  }else{
    return(
      <>
        <div className="test-container">
            <h2>User doesnt seem to exist</h2>
        </div>
      </>
    )
  }
}

export { GetAllData, GetSingleData, GetUserProfile }