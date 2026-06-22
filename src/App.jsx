import './App.css'
import { useEffect, useState } from 'react';
import { Route, Routes, NavLink, useNavigate} from 'react-router';
import { ContactPage, HomePage, TestPage, Register, Login, Profile, NotFound, CreatePost, Post, Search } from './Pages/Pages';
import { onAuthStateChanged, signOut  } from "firebase/auth";
import { auth } from "./firebase.js";

function App() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const authUser = auth.currentUser;
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
  }, []);

  function HandleSearchSubmit(e){
    e.preventDefault();
    console.log(search);
    navigate(`/search?id=${search.replace(/\s/g, '').toLowerCase()}`);
  }

  return (
      <>
        <header>
          <nav className='test-gap'>
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/contact" end>Contact</NavLink>
            {!user && <NavLink to="/register" end>Register</NavLink>}
            {user && <NavLink to="/createPost" end>CreatePost</NavLink>}
            {user && <NavLink to={{pathname: "/user", search: `id=${user.uid}`,}} end>Profile</NavLink>}
            <NavLink to="/login" end>{user ? "Logout" : "Login"}</NavLink>
          </nav>
          <form onSubmit={HandleSearchSubmit}>
            <input className="search-bar" type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}/>
            <button type="submit">Search</button>
          </form>
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
          <Route path="search" element={<Search/>}/>
        </Routes>

        <footer>
          feet
        </footer>
      </>
  )
}

export default App
