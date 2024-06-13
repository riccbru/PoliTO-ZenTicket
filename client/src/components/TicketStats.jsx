import { Badge, Button, ListGroup, Table } from "react-bootstrap";


function TicketStats(props) {
    return(
        <Table bordered hover>
            <thead>
                <tr>
                    <th colSpan={2} className="text-center">Analytics</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="text-center">
                        <div style={{color: '#6c757d'}}><b>OPEN</b></div>
                    </td>
                    <td className="text-center"><Badge bg='danger'>3</Badge></td>
                </tr>
                <tr>
                    <td className="text-center">
                        <div style={{color: '#6c757d'}}><b>CLOSED</b></div>
                    </td>
                    <td className="text-center"><Badge bg='success'>3</Badge></td>
                </tr>
                <tr>
                    <td className="text-center">
                        <div style={{color: '#fefeff'}}><b>TOTAL</b></div>
                    </td>
                    <td className="text-center"><Button disabled className='my-button-info'>6</Button></td>
                </tr>
            </tbody>
        </Table>
    );
}

export { TicketStats };