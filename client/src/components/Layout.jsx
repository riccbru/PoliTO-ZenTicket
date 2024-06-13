import api from "../api";
import { useEffect, useState } from "react";
import TicketsTable from "./Tickets";
import { NavBar } from "./NavBar";
import { LoginForm } from "./Login";
import { Outlet } from 'react-router-dom';
import { TicketStats } from "./TicketStats";
import { Button, Col, Container, Row, Table } from "react-bootstrap";

import dayjs from "dayjs";
import secElapsed from '../api';

function TableLayout(props) {

    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        api.getTickets()
            .then(tickets => {
                props.setTickets(tickets);
            })
            .catch(e => { props.handleErrors(e); });
    }, []);

    return(
        <Row>
            <Col>
                <TicketsTable loggedIn={props.loggedIn} tickets={props.tickets} />
            </Col>
        </Row>
    );
}

function Home(props) {

    const [tickets, setTickets] = useState([])
    const [loggedIn, setLoggedIn] = useState(false);
    
    useEffect(() => {
        console.log(`Home(useEffect)-1: loggedIn = ${props.loggedIn}`);
        console.log(`Home(useEffect)-1: tickets = ${props.tickets}`);
        props.setTickets([]);
        if (props.tickets) {
            api.getTickets()
            .then(tickets => {
                props.setTickets(tickets);
            })
            .catch(e => { props.handleErrors(e); });
        }
        console.log(`Home(useEffect)-2: loggedIn = ${props.loggedIn}`);
        console.log(`Home(useEffect)-2: tickets = ${props.tickets}`);
    }, [props.loggedIn]);

    return (
        <>
            <Row>
                <Col>
                    <NavBar user={props.user} loggedIn={props.loggedIn} logout={props.logout} />
                </Col>
            </Row>
            <p></p>
            <Row>
                <Col xs={3}>
                    <TicketStats></TicketStats>
                </Col>
                <Col xs={9}>
                    <TableLayout loggedIn={props.loggedIn} tickets={props.tickets} />
                </Col>
            </Row>
        </>
    );
}

function Common(props) {
    return(
        <>
            <Row>
                <Col><NavBar loggedIn={props.loggedIn} user={props.user} logout={props.logout}></NavBar></Col>
            </Row>
            <p></p>
            <Row>
                <Col xs={2}>
                    <TicketStats />
                    {props.loggedIn ? <><Button className='my-button'>&#43;</Button></> : null}
                    
                </Col>
                <Col xs={10}>
                    <Outlet />
                </Col>
            </Row>
        </>
    );
}

export { Common, Home, TableLayout };