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
        const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
        }));
        setDocs(data);
    }
    fetchData();
  },[]);
  return (
    <>
      {docs.map(doc => (
        <NavLink key={doc.id} className="test-container" to={{pathname: "/testPage", search: `id=${doc.id}`,}}>
          <p>{doc.data.name || "No name"}</p>
          <p>{doc.id}</p>
          <p>{doc.data.desc || "No description"}</p>
        </NavLink>
      ))}
    </>
  );
}

async function GetSingleData() {
  let collectionName = document.getElementById("getAllCollectionInput").value;
  let documentName = document.getElementById("getAllDocumentInput").value;
  const docSnap = await getDoc(doc(db, collectionName.trim(), documentName.trim()));
  console.log("Collection name: ",collectionName);
  console.log(documentName, "=>",docSnap.data());
  console.log("Name: ",docSnap.data().name);
  console.log("Description: ",docSnap.data().desc);
}

export { GetAllData }