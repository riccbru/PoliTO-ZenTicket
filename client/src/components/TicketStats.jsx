import { ListGroup, Table } from "react-bootstrap";


function TicketStats(props) {
    return(
        <Table borderless>
            <thead>
                <tr>
                    <th>Analytics</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>OPEN</td>
                    <td>5</td>
                </tr>
                <tr>
                    <td>CLOSED</td>
                    <td>4</td>
                </tr>
                <tr>
                    <td>TOTAL</td>
                    <td>9</td>
                </tr>
            </tbody>
        </Table>
    );
}

export { TicketStats };