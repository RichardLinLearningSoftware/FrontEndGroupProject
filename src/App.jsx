import './App.css'
import { useEffect, useState } from 'react';
import { BrowserRouter,  Route, Routes, NavLink} from 'react-router';
import { ContactPage, HomePage, TestPage, Register, Login } from './Pages/Pages';
import { onAuthStateChanged, signOut  } from "firebase/auth";
import { auth } from "./firebase.js";

function App() {
  const [user, setUser] = useState(null);
  const authUser = auth.currentUser;
  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
  }, []);

  return (
    <BrowserRouter>
      <>
        <nav className='test-gap'>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/contact" end>Contact</NavLink>
          {!user && <NavLink to="/register" end>Register</NavLink>}
          <NavLink to="/login" end>{user ? "Logout" : "Login"}</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="contact" element={<ContactPage/>}/>
          <Route path="testPage" element={<TestPage/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="login" element={<Login/>}/>
        </Routes>

        <footer>
          feet
        </footer>
      </>
    </BrowserRouter>
  )
}

export default App
