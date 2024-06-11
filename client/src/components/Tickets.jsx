import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState } from 'react';
import { Badge, Button, Table } from 'react-bootstrap';

function TicketsTable(props) {
    const { tickets } = props;


    return(
        <Table borderless className='ticket-table'>
            <thead>
                <tr>
                    <th className="text-center">ID</th>
                    <th className="text-center">Status</th>
                    <th>Subject</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Submission</th>
                </tr>
            </thead>
            <tbody>
                {tickets.map(ticket => <TicketRow ticketData={ticket} key={ticket.ticket_id} />)}
            </tbody>
        </Table>
    );
}

function TicketRow(props) {
    const [showContent, setShowContent] = useState(false);

    const toggleContent = () => {
        setShowContent(!showContent);
    };

    return(
        <>
            <tr>
                <td className="text-center">
                    <Button className='my-button' onClick={toggleContent}>{'#' + props.ticketData.ticket_id}</Button>
                </td>
                <td className="text-center">
                    {props.ticketData.state ? <Badge bg="danger">OPEN</Badge>
                        : <Badge bg="success">CLOSED</Badge>}
                </td>
                <td><b>{props.ticketData.title}</b></td>
                <td>{props.ticketData.author_id}</td>
                <td>{props.ticketData.category}</td>
                <td>{props.ticketData.submission_time}</td>
            </tr>
            {showContent ?  <TicketContentRow content={props.ticketData.content} /> : null}
        </>
    );
}

function TicketContentRow(props) {
    return(
        <>
        <tr>
            {/* <td>{props.author_id}</td> */}
            <td></td>
            <td colSpan={4} className='ticket-content'>{props.content}</td>
            <td></td>
        </tr>
        </>
    );
}


export default TicketsTable;
