import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import api from './api.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { LoginForm } from './components/AuthN';
import { Navigation } from './components/Navigation.jsx';
import { Container, Row, Col, Button, Toast } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Outlet, Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { Main } from './components/Layout.jsx';

function App() {
  return (
    <BrowserRouter>
      <AppRouted />
    </BrowserRouter>
  );
}

function AppRouted(props) {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  
  return (
    <Container fluid>
      <Routes>
        <Route path="/" element={<Main></Main>}></Route>
        <Route path="/login" element={!loggedIn ? <LoginForm login={api.login}></LoginForm> : <Navigate replace to='/'></Navigate>}>
        </Route>
      </Routes>
    </Container>
  );
}

export default App
