import { Navigation } from "./Navigation";
import { Col, Container, Row, Table } from "react-bootstrap";

function Main(props) {
    return (
        <>
            <Row>
                <Col>
                    <Navigation loggedIn={props.loggedIn} user={props.user} logout={props.logout}></Navigation>
                </Col>
            </Row>
            <Row>
                <Col xs={4}></Col>
                <Col xs={8}>
                    <Table style={{color: '#fefeff', backgroundColor: '#143859'}}>
                        <thead>
                            <tr>
                                <th>First</th>
                                <th>Second</th>
                                <th>Third</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>first</td>
                                <td>second</td>
                                <td>third</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );
}

export { Main };