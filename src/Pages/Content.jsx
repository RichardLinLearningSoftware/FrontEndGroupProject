import { collection, doc, getDoc, getDocs, getFirestore, where, addDoc, deleteDoc, updateDoc  } from "firebase/firestore";
import { firebaseConfig, app, db, auth } from "../firebase.js";
import { BrowserRouter,  Route, Routes, NavLink} from 'react-router';
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
  const [data, setData] = useState(null);
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

export { GetAllData, GetSingleData }