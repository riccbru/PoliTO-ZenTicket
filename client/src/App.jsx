import './App.css'
import api from './api.js';
import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoginForm } from './components/Login.jsx';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Common, AddLayout, TableLayout } from './components/Layout.jsx';
import { Container, Row, Col, Button, Toast } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { NavBar } from './components/NavBar.jsx';

function App() {
  return (
    <BrowserRouter>
      <AppRouted />
    </BrowserRouter>
  );
}

function AppRouted(props) {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(()=> {
    const checkAuth = async() => {
      try {
        const user = await api.info();
        setLoggedIn(true);
        setUser(user);
      } catch(err) { }
    };
    checkAuth();
  }, []);

  const beautyName = (username) => {
    if (username) {
      const uname = username.username;
      const words = uname.split('_');
      const name = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      const surname = words[1].charAt(0).toUpperCase() + words[1].slice(1);
      return `${name} ${surname}`;
    } else { return null; }
}

  const handleErrors = (err) => {
    let msg = '';
    if (err.error)
      msg = err.error;
    else if (err.errors) {
      if (err.errors[0].msg)
        msg = err.errors[0].msg + " : " + err.errors[0].path;
    } else if (Array.isArray(err))
      msg = err[0].msg + " : " + err[0].path;
    else if (typeof err === "string") msg = String(err);
    else msg = "Unknown Error";
    setMessage(msg); 
    console.log(err);

    // setTimeout( () => setDirty(true), 2000);
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await api.login(credentials);
      setUser(user);
      setLoggedIn(true);
    } catch(err) {
      throw err;
    }
  }

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setLoggedIn(false);
  }

  function addTicket(ticket) {
    api.addTicket(ticket)
      .then(navigate("/"))
      .catch(e => handleErrors(e));
  }
  
  return (
    <Container fluid>
      <Routes>
        <Route path="/" element={<Common loggedIn={loggedIn} user={beautyName(user)} logout={handleLogout} />}>
          <Route index element={<TableLayout loggedIn={loggedIn}
                        tickets={tickets} setTickets={setTickets}
                        handleErrors={handleErrors}/>} />
          <Route path="/add" element={<AddLayout addTicket={addTicket}/>} />
        </Route>
        <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <LoginForm login={handleLogin} />} />
      </Routes>
    </Container>
  );
}

export default App
