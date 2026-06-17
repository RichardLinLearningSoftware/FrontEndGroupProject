import { collection, doc, getDoc, getDocs, getFirestore, where, addDoc, deleteDoc, updateDoc, query } from "firebase/firestore";
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
  const [comment, setComment] = useState("");
  const [data, setData] = useState();
  const [user, setUser] = useState(null);
  const authUser = auth.currentUser;
  const [commentRefresh, setCommentRefresh] = useState(0);
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

    const comments = await getDocs(query(collection(db, "PostComments"), where("postId", "==", data.id)));
    
    const deletePromises = comments.docs.map(comment =>
      deleteDoc(doc(db, "PostComments", comment.id))
    );
    await Promise.all(deletePromises);

    await deleteDoc(doc(db, "Posts", documentName));
    setData(null);
  }

  async function CreateComment(e, id) {
    e.preventDefault();
    await addDoc(collection(db, "PostComments"), {
      uid: user.uid,
      comment: comment,
      postId: id
    });
    
    setComment("");
    setCommentRefresh(commentRefresh + 1);
  }

  if (data) {
    if(user){
      return (
        <>
          <div className="post">
            <button onClick={DeletePost}>Delete post</button>
            <h2>title: {data.data().title}</h2>
            <p>id: {data.id}</p>
            <NavLink to={{ pathname: "/user", search: `id=${data.data().uid}`, }} end>user: {data.data().user}</NavLink>
            <p>uid: {data.data().uid}</p>
            <p>desc: {data.data().description}</p>
            <RenderMedia media={data.data()} />
          </div>
          <form onSubmit={(e) => CreateComment(e, data.id)}>
            <textarea value={comment} id="commentArea" onChange={(e) => setComment(e.target.value)} placeholder="Comment" required></textarea>
            <button type="submit">Submit</button>
          </form>
          <RenderComments id={data.id} refresh={commentRefresh}/>
        </>
      );
    }else{
      return (
        <>
          <div className="post">
            <h2>title: {data.data().title}</h2>
            <p>id: {data.id}</p>
            <NavLink to={{ pathname: "/user", search: `id=${data.data().uid}`, }} end>user: {data.data().user}</NavLink>
            <p>uid: {data.data().uid}</p>
            <p>desc: {data.data().description}</p>
            <RenderMedia media={data.data()} />
          </div>

          <RenderComments id={data.id} refresh={commentRefresh}/>
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

function RenderComments({id, refresh}){
  const [docs, setDocs] = useState([]);
  const [ deleteRefresh, setDeleteRefresh] = useState(0);
  useEffect(() => {
    async function LoadComments() {
      const querySnapshot = await getDocs(query(collection(db, "PostComments"), where("postId", "==", id)));
      setDocs(querySnapshot.docs);
    }
    LoadComments();
  }, [id, refresh, deleteRefresh]);

  async function DeleteComment(id) {
    await deleteDoc(doc(db, "PostComments", id));
    setDeleteRefresh(deleteRefresh + 1);
  }

  if (docs.length == 0) {
    return (
      <>
        <div className="test-container">
          <h2>No comments yet</h2>
        </div>
      </>
    )
  }
  return (
    <>
      {docs.map(doc =>
        <div className="post" key={doc.id}>
            <button onClick={() => DeleteComment(doc.id)}>Delete comment</button>
            <p>user: {doc.data().uid}</p>
            <p>{doc.data().comment}</p>
        </div>
      )}
    </>
  );
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
    if (user) {
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
          <GetUserSpecificPost userId={userId} />
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

          <h2>User post</h2>
          <GetUserSpecificPost userId={userId} />
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

function GetUserSpecificPost({ userId }) {
  const [docs, setDocs] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "Posts"));
      setDocs(querySnapshot.docs);
    }
    fetchData();
  }, []);

  if (docs.filter(doc => doc.data().uid == userId).length == 0) {
    return (
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