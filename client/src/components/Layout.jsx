import api from "../api";
import { useEffect, useState } from "react";
import TicketsTable from "./Tickets";
import { NavBar } from "./NavBar";
import { LoginForm } from "./Login";
import { Outlet } from 'react-router-dom';
import { TicketStats } from "./TicketStats";
import { TicketAdd } from "./TicketAdd";
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
                <TicketsTable loggedIn={props.loggedIn}
                        uid={props.uid} admin={props.admin} user={props.user}
                        tickets={props.tickets} addBlock={props.addBlock}
                        update={props.update} setUpdate={props.setUpdate}/>
            </Col>
        </Row>
    );
}

function AddLayout(props) {
    return(
        <Row>
            <Col>
                <TicketAdd uid={props.uid} user={props.user} addTicket={props.addTicket}/>
            </Col>
        </Row>
    );
}

function Common(props) {
    return(
        <>
            <Row>
                <Col><NavBar loggedIn={props.loggedIn} uid={props.uid} admin={props.admin} user={props.user} logout={props.logout}></NavBar></Col>
            </Row>
            <p></p>
            <Row>
                <Col xs={2}>
                    <TicketStats />
                </Col>
                <Col xs={10}>
                    <Outlet />
                </Col>
            </Row>
        </>
    );
}

export { Common, AddLayout, TableLayout };

// function Home(props) {

//     const [tickets, setTickets] = useState([])
//     const [loggedIn, setLoggedIn] = useState(false);
    
//     useEffect(() => {
//         console.log(`Home(useEffect)-1: loggedIn = ${props.loggedIn}`);
//         console.log(`Home(useEffect)-1: tickets = ${props.tickets}`);
//         props.setTickets([]);
//         if (props.tickets) {
//             api.getTickets()
//             .then(tickets => {
//                 props.setTickets(tickets);
//             })
//             .catch(e => { props.handleErrors(e); });
//         }
//         console.log(`Home(useEffect)-2: loggedIn = ${props.loggedIn}`);
//         console.log(`Home(useEffect)-2: tickets = ${props.tickets}`);
//     }, [props.loggedIn]);

//     return (
//         <>
//             <Row>
//                 <Col>
//                     <NavBar user={props.user} loggedIn={props.loggedIn} logout={props.logout} />
//                 </Col>
//             </Row>
//             <p></p>
//             <Row>
//                 <Col xs={3}>
//                     <TicketStats></TicketStats>
//                 </Col>
//                 <Col xs={9}>
//                     <TableLayout loggedIn={props.loggedIn} tickets={props.tickets} />
//                 </Col>
//             </Row>
//         </>
//     );
// }