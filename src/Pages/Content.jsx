import { collection, doc, getDoc, getDocs, getFirestore, where, addDoc, deleteDoc, updateDoc  } from "firebase/firestore";
import { firebaseConfig, app, db, auth } from "../firebase.js";
import { BrowserRouter,  Route, Routes, NavLink} from 'react-router';
import { onAuthStateChanged, signOut  } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

function GetAllData() {
  const [docs, setDocs] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "TestCollection"));
      setDocs(querySnapshot.docs);
    }
    fetchData();
  },[]);
  return (
    <>
      {docs.map(doc => 
        <NavLink key={doc.id} className="test-container" to={{pathname: "/testPage", search: `id=${doc.id}`,}}>
          <h2>{doc.data().name || "No name"}</h2>
          <p>{doc.id}</p>
          <p>{doc.data().desc || "No description"}</p>
        </NavLink>
      )}
    </>
  );
}

function GetSingleData({ documentName }) {
  const [data, setData] = useState();
  useEffect(() => {
    async function fetchData() {
      const docSnap = await getDoc(doc(db, "TestCollection", documentName));
      setData(docSnap);
    }
    fetchData();
  }, [documentName]);
  if (data) {
    return (
      <>
        <div className="test-container">
          <h2>{data.data().name || "No name"}</h2>
          <p>{data.id}</p>
          <p>{data.data().desc || "No Description"}</p>
        </div>
      </>
    );
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