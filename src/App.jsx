import './App.css'
import { useEffect, useState } from 'react';
import { BrowserRouter,  Route, Routes, NavLink} from 'react-router';
import { ContactPage, HomePage, TestPage, Register, Login } from './Pages/Pages';

function App() {

  return (
    <BrowserRouter>
      <>
        <nav className='test-gap'>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/contact" end>Contact</NavLink>
          <NavLink to="/register" end>Register</NavLink>
          <NavLink to="/login" end>Login</NavLink>
          <NavLink to={{
              pathname: "/testPage",
              search: "id=" + "test",
          }} >Test</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="contact" element={<ContactPage/>}/>
          <Route path="testPage" element={<TestPage/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="/test:id" element={<TestPage/>} />
        </Routes>

        <footer>
          feet
        </footer>
      </>
    </BrowserRouter>
  )
}

export default App
