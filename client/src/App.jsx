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

  const [uid, setUID] = useState(null);
  const [admin, setAdmin] = useState(0);
  const [user, setUser] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [update, setUpdate] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(()=> {
    const checkAuth = async() => {
      try {
        const user = await api.info();
        setLoggedIn(true);
        setUID(user.id);
        setAdmin(user.admin);
        setUser(user.username);
      } catch(err) { }
    };
    checkAuth();
  }, []);


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
      setLoggedIn(true);
      setUID(user.id);
      setAdmin(user.admin);
      setUser(user.username);
    } catch(err) {
      throw err;
    }
  }

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setLoggedIn(false);
    setUID(null);
    setAdmin(0);
  }

  function addTicket(ticket) {
    api.addTicket(ticket)
      .then(() => {
        setUpdate(true);
        navigate("/");
      })
      .catch(e => handleErrors(e));
  }

  function changeCategory(cat) {
    api.changeCategory(cat)
      .then(() => {
        setUpdate(true);
        navigate("/");
      })
  }

  function addBlock(block) {
    api.addBlock(block)
      .then(() => {
        setUpdate(true);
        navigate("/");
      })
      .catch(e => handleErrors(e));
  }

  
  return (
    <Container fluid>
      <Routes>
        <Route path="/" element={<Common loggedIn={loggedIn} uid={uid} admin={admin} user={user} logout={handleLogout} />}>
          <Route index element={<TableLayout loggedIn={loggedIn}
                        uid={uid} admin={admin} user={user}
                        tickets={tickets} setTickets={setTickets}
                        addBlock={addBlock}
                        handleErrors={handleErrors}
                        update={update} setUpdate={setUpdate}/>} />
          <Route path="/add" element={loggedIn ? <AddLayout uid={uid} user={user} addTicket={addTicket}/> : <Navigate to="/login" />} />
        </Route>
        <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <LoginForm login={handleLogin} />} />
      </Routes>
    </Container>
  );
}

export default App
