import { collection, doc, getDoc, getDocs, getFirestore, where, addDoc, deleteDoc, updateDoc  } from "firebase/firestore";
import { firebaseConfig, app, db, auth } from "../firebase.js";
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
        <div className="test-container" key={doc.id}>
          <h2>{doc.data.name}</h2>
          <p>Lorem ipsum</p>
        </div>
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