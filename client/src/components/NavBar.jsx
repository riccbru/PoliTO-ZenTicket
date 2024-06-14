import 'bootstrap-icons/font/bootstrap-icons.css';
import { LoginButton, LogoutButton } from './Login';
import { Button, Container, Navbar } from 'react-bootstrap';


function NavBar(props) {

    const beautyName = (uname) => {
        if (uname) {
          const words = uname.split('_');
          const name = words[0].charAt(0).toUpperCase() + words[0].slice(1);
          const surname = words[1].charAt(0).toUpperCase() + words[1].slice(1);
          return `${name} ${surname}`;
        } else { return null; }
    }

    return(
        <Navbar className='my-navbar' >
            <Container fluid>
                <Navbar.Brand href='/' className="mx-3" style={{ color: '#fefeff' }}>
                    <img alt='' src='../brand.png' width='45' height='45' className='mx-3'/>
                    <span style={{display: 'inline-block', verticalAlign: 'middle'}}><h1>ZenTicket</h1></span>
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className='justify-content-end'>
                    {props.admin ? <Navbar.Text className={'mx-1'} style={{color: '#ffc108', fontSize: '20px'}}>{beautyName(props.user)}</Navbar.Text>
                    : <Navbar.Text className={'mx-1'} style={{color: '#808080', fontSize: '20px'}}>{beautyName(props.user)}</Navbar.Text>}
                    {props.loggedIn ? <i class='bi bi-person-fill my-icon mx-3'></i> : <i class='bi bi-person my-icon mx-3'></i>}
                    {!props.loggedIn ? <LoginButton /> : <LogoutButton logout={props.logout} />}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export { NavBar };