import api from "../api";
import { useEffect, useState } from "react";
import TicketsTable from "./Tickets";
import { NavBar } from "./NavBar";
import { LoginForm } from "./Login";
import { Outlet } from 'react-router-dom';
import { TicketAdd } from "./TicketAdd";
import { Button, Col, Container, Row, Table } from "react-bootstrap";

import dayjs from "dayjs";
import secElapsed from '../api';

function TableLayout(props) {

    useEffect(() => {
        api.getTickets()
            .then(tickets => {
                props.setTickets(tickets);
            })
            .catch(e => { props.handleErrors(e); });
    }, []);

    const parseTickets = (tickets) => {
        const parsed = tickets.map(
            ({ state, author_id, ticket_author_username, submission_time, content, ...rest }) => rest
        );
        return parsed;
    }

    useEffect(() => {
        if (props.tickets) {
            if (props.authToken) {
                api.getStats(props.authToken, parseTickets(props.tickets))
                    .then(stats => {
                        props.setStats(stats);
                        // console.log(Array.isArray(stats)); // true
                        // console.log(stats);
                    })
                    .catch(err => {
                        api.getAuthToken()
                            .then(resp => props.setAuthToken(resp.token));
                    });
            }
        }
    }, [props.authToken, props.tickets]);

    return(
        <Row>
            <Col>
                <TicketsTable loggedIn={props.loggedIn}
                        uid={props.uid} admin={props.admin} user={props.user}
                        tickets={props.tickets} stats={props.stats}
                        addBlock={props.addBlock}
                        update={props.update} setUpdate={props.setUpdate}/>
            </Col>
        </Row>
    );
}

function AddLayout(props) {
    return(
        <Row>
            <Col xs={3}></Col>
            <Col xs={6}>
                <TicketAdd uid={props.uid} user={props.user} addTicket={props.addTicket} authToken={props.authToken} />
            </Col>
            <Col xs={3}></Col>
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
                {/* <Col xs={2}>
                    <TicketStats open={props.open} setOpen={props.setOpen} close={props.close} setClose={props.setClose}/>
                </Col> */}
                <Col xs={12}>
                    <Outlet />
                </Col>
            </Row>
        </>
    );
}

export { Common, AddLayout, TableLayout };