import api from "../api";
import { useEffect, useState } from "react";
import TicketsTable from "./Tickets";
import { NavBar } from "./NavBar";
import { LoginForm } from "./Login";
import { Outlet, useNavigate } from "react-router-dom";
import { TicketAdd } from "./TicketAdd";
import { Button, Col, Container, Row, Table } from "react-bootstrap";

import dayjs from "dayjs";
import secElapsed from "../api";

function TableLayout(props) {

  const [updateStats, setUpdateStats] = useState(false);
    
  useEffect(() => {
    api.getTickets()
      .then((tickets) => {
        props.setTickets(tickets);
      })
      .catch((e) => {
        props.handleErrors(e);
      });
  }, []);

  const parseTickets = (tickets) => {
    const parsed = tickets.map(
      ({
        state,
        author_id,
        ticket_author_username,
        submission_time,
        content,
        ...rest
      }) => rest
    );
    return parsed;
  };

  useEffect(() => {
    if (props.tickets) {
      if (props.admin && props.authToken) {
        api
          .getStats(props.authToken, parseTickets(props.tickets))
          .then((stats) => {
            props.setStats(stats);
          })
          .catch((err) => {
            api.getAuthToken().then((resp) => props.setAuthToken(resp.token));
          });
      }
    }
  }, [props.admin, props.authToken, props.tickets, updateStats]);

  const refresh = () => {
    setUpdateStats((prev) => !prev);
  }

  return (
    <Row>
      <Col>
        <TicketsTable
          loggedIn={props.loggedIn}
          uid={props.uid}
          admin={props.admin}
          user={props.user}
          token={props.authToken}
          tickets={props.tickets}
          setTickets={props.setTickets}
          stats={props.stats}
          setStats={props.setStats}
          addBlock={props.addBlock}
          update={props.update}
          setUpdate={props.setUpdate}
          refresh={refresh}
        />
      </Col>
    </Row>
  );
}

function AddLayout(props) {
  return (
    <Row>
      <Col xs={3}></Col>
      <Col xs={6}>
        <TicketAdd
          uid={props.uid}
          user={props.user}
          addTicket={props.addTicket}
          authToken={props.authToken}
        />
      </Col>
      <Col xs={3}></Col>
    </Row>
  );
}

function Common(props) {
  return (
    <>
      <Row>
        <Col>
          <NavBar
            loggedIn={props.loggedIn}
            uid={props.uid}
            admin={props.admin}
            user={props.user}
            logout={props.logout}
          ></NavBar>
        </Col>
      </Row>
      <p></p>
      <Row>
        <Col xs={1}></Col>
        <Col xs={10}>
          <Outlet />
        </Col>
        <Col xs={1}></Col>
      </Row>
    </>
  );
}

function NotFound() {
    const navigate = useNavigate();
  return (
    <>
    <p></p>
      <div className="text-center" style={{ color: "#fefeff" }}>
        <h1>404 Not Found</h1>
        <p></p>
        <h5>The page you are looking for does not exist</h5>
        <p></p>
        <Button className="my-button" onClick={() => navigate("/")}>Back to main page</Button>
      </div>
    </>
  );
}

export { Common, AddLayout, TableLayout, NotFound };
