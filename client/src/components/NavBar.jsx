import 'bootstrap-icons/font/bootstrap-icons.css';
import { LoginButton, LogoutButton } from './Login';
import { Button, Container, Navbar } from 'react-bootstrap';


function NavBar(props) {
    return(
        <Navbar className='my-navbar' >
            <Container fluid>
                <Navbar.Brand className="mx-3" style={{ color: '#fefeff' }}>
                    <i className="bi bi-ticket-detailed mx-3" />
                    ZenTicket
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className='justify-content-end'>
                    <Navbar.Text className={'mx-1'} style={{color: '#808080', fontSize: '20px'}}>{props.loggedIn ? props.user : null}</Navbar.Text>
                    {props.loggedIn ? <i class='bi bi-person-fill my-icon mx-3'></i> : <i class='bi bi-person my-icon mx-3'></i>}
                    {!props.loggedIn ? <LoginButton /> : <LogoutButton logout={props.logout} />}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export { NavBar };