import { collection, doc, getDoc, getDocs, getFirestore, where, addDoc, deleteDoc, updateDoc  } from "firebase/firestore";
import { firebaseConfig, app, db } from "../firebase.js";
/* 
Check if a document exist

var docRef = db.collection("cities").doc("SF");

docRef.get().then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});
*/

async function GetSingleData() {
  let collectionName = document.getElementById("getAllCollectionInput").value;
  let documentName = document.getElementById("getAllDocumentInput").value;
  const docSnap = await getDoc(doc(db, collectionName.trim(), documentName.trim()));
  console.log("Collection name: ",collectionName);
  console.log(documentName, "=>",docSnap.data());
  console.log("Name: ",docSnap.data().name);
  console.log("Description: ",docSnap.data().desc);
}

async function GetAllData() {
  let collectionName = document.getElementById("getAllCollectionInput").value;
  const querySnapshot = await getDocs(collection(db, collectionName.trim()));
  console.log("Collection name: ",collectionName);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, "=>",doc.data());
  });
}

async function CreateData() {
    addDoc(collection(db, "testingStuff"), {
        name: "Los Angeles",
        state: "CA",
        country: "USA"
    });
}

async function  DeleteData() {
    await deleteDoc(doc(db, "testingStuff", "x9mxYWDlEjximOYTTUJG"));
}

async function UpdateData() {
    await updateDoc(doc(db, "testingStuff", "nUiYdiWehBtvDxofm7pe"), { 
        name: "wow", 
        country: "cooler"
    });
}

export { GetAllData, GetSingleData, CreateData, DeleteData, UpdateData };