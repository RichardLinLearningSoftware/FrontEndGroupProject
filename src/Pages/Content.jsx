import { collection, doc, getDoc, getDocs, getFirestore, where, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { firebaseConfig, app, db, auth } from "../firebase.js";
import { BrowserRouter, Route, Routes, NavLink } from 'react-router';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { supabase } from "../supabase.js";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

function RenderMedia(media) {
  const type = media.media.fileType;
  const mediaUrl = media.media.media;
  if (type != null) {
    if (type?.startsWith("image/")) {
      return (
        <img src={mediaUrl} />
      );
    }

    if (type?.startsWith("video/")) {
      return (
        <video src={mediaUrl} controls />
      );
    }

    if (type?.startsWith("audio/")) {
      return (
        <audio src={mediaUrl} controls />
      );
    } else {
      const { scene } = useGLTF(mediaUrl);
      return (
        <Canvas style={{ width: "20vw", height: "20vw" }} className="modelViewPortSmall">
          <ambientLight intensity={2} />
          <primitive object={scene} />
          <OrbitControls />
        </Canvas>
      )
    }
  }
}

function GetAllData() {
  const [docs, setDocs] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "Posts"));
      setDocs(querySnapshot.docs);
    }
    fetchData();
  }, []);

  if (docs.length == 0) {
    return (
      <>
        <div className="test-container">
          <h2>No content yet</h2>
        </div>
      </>
    )
  }
  return (
    <>
      {docs.map(doc =>
        <div className="post" key={doc.id}>
          <NavLink to={{ pathname: "/post", search: `id=${doc.id}`, }}>
            <h2>title: {doc.data().title}</h2>
            <p>id: {doc.id}</p>
            <p>user: {doc.data().user}</p>
            <p>uid: {doc.data().uid}</p>
            <p>desc: {doc.data().description}</p>
          </NavLink>
          <RenderMedia media={doc.data()} />
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
      if (docSnap.exists()) {
        setData(docSnap);
      }
    }
    fetchData();
  }, [documentName]);

  async function DeletePost() {
    if (data.data().filePath) {
      await supabase.storage
        .from("MediaPost")
        .remove([data.data().filePath]);
    }
    await deleteDoc(doc(db, "Posts", documentName));
    setData(null);
  }

  if (data) {
    if (user) {
      return (
        <>
          <div className="view-post">
            <h2>title: {data.data().title}</h2>
            <p>id: {data.id}</p>
            <NavLink to={{ pathname: "/user", search: `id=${data.data().uid}`, }} end>user: {data.data().user}</NavLink>
            <p>uid: {data.data().uid}</p>
            <p>desc: {data.data().description}</p>
            <RenderMedia media={data.data()} />
            {user.uid == data.data().uid && <button onClick={DeletePost}>Delete post</button>}
          </div>
        </>
      );
    }
  } else {
    return (
      <>
        <div className="test-container">
          <h2>This post doesnt seem to exist</h2>
        </div>
      </>
    )
  }
}

function GetUserProfile({ userId }) {
  if (userId == null) {
    return (
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
      if (docSnap.exists()) {
        setUserExits(true)
        setData(docSnap);
        setBio(docSnap.data().bio);
      }
    }
    fetchData();
  }, [userId]);

  async function UpdateProfile(e) {
    e.preventDefault();
    await updateDoc(doc(db, "Users", userId), {
      bio: bio
    });
  }

  if (data && userExits) {
    if (user && userId == user.uid) {
      return (
        <>
          <div className="test-container">
            <h2>{data.data().name || "No name"}</h2>
            <p>{data.id}</p>
            <form onSubmit={UpdateProfile}>
              <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="About me" />
              <button type="submit">Update profile</button>
            </form>
          </div>

          <h2>User post</h2>
          <GetUserSpecificPost userId = {userId}/>
        </>
      );
    } else {
      return (
        <>
          <div className="test-container">
            <h2>{data.data().name || "No name"}</h2>
            <p>{data.id}</p>
            <p>{data.data().bio || "No Description"}</p>
          </div>

          <h2>User post</h2>
          <GetUserSpecificPost userId = {userId}/>
        </>
      );
    }
  } else {
    return (
      <>
        <div className="test-container">
          <h2>User doesnt seem to exist</h2>
        </div>
      </>
    )
  }
}

function GetUserSpecificPost({userId}) {
  const [docs, setDocs] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "Posts"));
      setDocs(querySnapshot.docs);
    }
    fetchData();
  }, []);

  if(docs.filter(doc => doc.data().uid == userId).length == 0){
    return(
      <>
        <div className="post">
          <h2>User havent post anything</h2>
        </div>
      </>
    )
  }
  return (
    <>
      {docs.filter(doc => doc.data().uid == userId).map(doc =>
        <div className="post" key={doc.id}>
          <NavLink to={{ pathname: "/post", search: `id=${doc.id}`, }}>
            <h2>title: {doc.data().title}</h2>
            <p>id: {doc.id}</p>
            <p>user: {doc.data().user}</p>
            <p>uid: {doc.data().uid}</p>
            <p>desc: {doc.data().description}</p>
          </NavLink>
          <RenderMedia media={doc.data()} />
        </div>
      )}
    </>
  );
}

export { GetAllData, GetSingleData, GetUserProfile }