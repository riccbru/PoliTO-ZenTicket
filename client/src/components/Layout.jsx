import api from "../api";
import { useEffect } from "react";
import TicketsTable from "./Tickets";
import { NavBar } from "./Navigation";
import { Outlet } from 'react-router-dom';
import { TicketStats } from "./TicketStats";
import { Button, Col, Container, Row, Table } from "react-bootstrap";

function LoginLayout(props) {
    return(
        <LoginForm login={props.login} />
    );
}

function TableLayout(props) {
    return(
        <TicketsTable tickets={props.tickets} />
    );
}

function CommonLayout(props) {
    
    useEffect(() => {
        if (props.tickets) {
            api.getTickets()
            .then(tickets => {
                props.setTickets(tickets);
            })
            .catch(e => { console.log(e) }); // props.handleErrors(e);
        }
    }, []);

    return (
        <Container fluid>
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
                    <TableLayout tickets={props.tickets} />
                </Col>
            </Row>
        </Container>
    );
}

export { CommonLayout, TableLayout };