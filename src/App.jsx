import { useState } from 'react'
import './App.css'
import { GetAllData, GetSingleData, CreateData, DeleteData, UpdateData } from './test.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Testing</h1>
      <div className='flex-col'>
        <input id="getAllCollectionInput" placeholder = "collection name" type="text"></input>
        <input id="getAllDocumentInput" placeholder = "document name" type="text"></input>
        <button onClick={GetAllData}>Get all data</button>
        <button onClick={GetSingleData}>Get a data</button>
        <button onClick={CreateData}>Create a data</button>
        <button onClick={DeleteData}>Delete a data</button>
        <button onClick={UpdateData}>Update a data</button>
      </div>
    </>
  )
}

export default App
