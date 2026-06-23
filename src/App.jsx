import './App.css'
import { useEffect, useState } from 'react';
import { BrowserRouter,  Route, Routes, NavLink} from 'react-router';
import { ContactPage, HomePage, TestPage, Register, Login, Profile, NotFound, CreatePost, Post } from './Pages/Pages';
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
        <header>
          <nav className='test-gap'>
            <NavLink className = 'link' to="/" end>Home</NavLink>
            <NavLink className = 'link' to="/contact" end>Contact</NavLink>
            {!user && <NavLink className = 'link' to="/register" end>Register</NavLink>}
            {user && <NavLink className = 'link' to="/createPost" end>CreatePost</NavLink>}
            {user && <NavLink className = 'link' to={{pathname: "/user", search: `id=${user.uid}`,}} end>Profile</NavLink>}
            <NavLink className = 'link' to="/login" end>{user ? "Logout" : "Login"}</NavLink>
          </nav>
          
        </header>

        <Routes>
          <Route path="*" element={<NotFound/>}/>
          <Route path="/" element={<HomePage/>}/>
          <Route path="contact" element={<ContactPage/>}/>
          <Route path="testPage" element={<TestPage/>}/>
          <Route path="post" element={<Post/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="createPost" element={<CreatePost/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="user" element={<Profile/>}/>
        </Routes>

        <footer className="footer">
          <div className="footer-content">
            Richard - Joey
          </div>
        </footer>
      </>
    </BrowserRouter>
  )
}

export default App
