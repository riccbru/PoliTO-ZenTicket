import './App.css'
import api from './api.js';
import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoginForm } from './components/AuthN';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { CommonLayout, TableLayout } from './components/Layout.jsx';
import { Container, Row, Col, Button, Toast } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <AppRouted />
    </BrowserRouter>
  );
}

function AppRouted(props) {

  const navigate = useNavigate();

  const [user, setUser] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);



  const handleErrors = (err) => {
    //console.log('DEBUG: err: '+JSON.stringify(err));
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
    setMessage(msg); // WARNING: a more complex application requires a queue of messages. In this example only the last error is shown.
    console.log(err);

    setTimeout( () => setDirty(true), 2000);
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
    setLoggedIn(false);
    setUser(null);
  }
  
  return (
    <Container fluid>
      <Routes>
        <Route index element={<CommonLayout loggedIn={true} tickets={tickets} user={user} setTickets={setTickets} handleErrors={handleErrors} logout={handleLogout}/>} />
        {/* <Route path="/login" element={!loggedIn ? <LoginForm login={handleLogin}></LoginForm> : <Navigate replace to='/'></Navigate>}></Route> */}
      </Routes>
    </Container>
  );
}

export default App
