import './App.css'
import api from './api.js';
import { Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { LoginForm } from './components/Login.jsx';
import { Common, AddLayout, TableLayout, NotFound } from './components/Layout.jsx';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <AppRouted />
    </BrowserRouter>
  );
}

function AppRouted() {

  const navigate = useNavigate();

  const [uid, setUID] = useState(null);
  const [admin, setAdmin] = useState(0);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([]);
  const [update, setUpdate] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(undefined);

  useEffect(()=> {
    const checkAuth = async() => {
      try {
        const user = await api.info();
        setLoggedIn(true);
        setUID(user.id);
        setAdmin(user.admin);
        setUser(user.username);
        api.getAuthToken()
          .then(r => { setAuthToken(r.token) });
      } catch(err) { handleErrors(err); }
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
    // console.log(`handleErrors(App.jsx) - msg:\t${msg}`);
  }

  const renewToken = () => {
    api.getAuthToken().then((resp) => { setAuthToken(resp.token); } )
    .catch(err => { handleErrors(err); });
  }

  const handleLogin = async (credentials) => {
    const user = await api.login(credentials);
    setLoggedIn(true);
    setUID(user.id);
    setAdmin(user.admin);
    setUser(user.username);
    renewToken();
  }

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setLoggedIn(false);
    setUID(null);
    setAdmin(0);
    setAuthToken(undefined);
  }

  function addTicket(ticket) {
    api.addTicket(ticket)
      .then(() => {
        setUpdate(true);
        navigate("/");
      })
      .catch(e => handleErrors(e));
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
                        authToken={authToken} setAuthToken={setAuthToken}
                        stats={stats} setStats={setStats}
                        update={update} setUpdate={setUpdate}
                        handleErrors={handleErrors}/>} />
          <Route path="/add" element={loggedIn ? <AddLayout uid={uid} user={user} addTicket={addTicket} authToken={authToken} stats={stats}/> : <Navigate to="/" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <LoginForm login={handleLogin} />} />
      </Routes>
    </Container>
  );
}

export default App