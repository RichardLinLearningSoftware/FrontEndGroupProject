import './App.css'
import { useEffect, useState } from 'react';
import { BrowserRouter,  Route, Routes, NavLink} from 'react-router';
import { ContactPage, HomePage, TestPage } from './Pages/Pages';

function App() {
  function ClickCoin(coin) {
    navigate(`/${coin.NAME}`);
  }

  return (
    <BrowserRouter>
      <>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/contact" end>Contact</NavLink>
          <NavLink to={{
              pathname: "/testPage",
              search: "id=" + "test",
          }} >Test</NavLink>
        </nav>

        <Routes>

          <Route path="/" element={<HomePage/>}/>
          <Route path="contact" element={<ContactPage/>}/>
          <Route path="testPage" element={<TestPage/>}/>
        </Routes>

        <footer>
          feet
        </footer>
      </>
    </BrowserRouter>
  )
}

export default App
