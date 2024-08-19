import { Button, Container, Navbar } from 'react-bootstrap';
import './SideNav.css';
import { Link } from 'react-router-dom';

export default function SideNav() {
    return (
        <Container id="navbar-container">
            <Navbar id='navbar' className="d-flex flex-column" expand="lg" variant="dark" bg="light" fixed="center">
                <Container id='button-container' style={{ marginTop: 20 }} className="d-flex flex-column">
                    <Button className='button d-flex justify-content-center align-items-center' variant='success' style={{ borderBottom: '1px solid gray', marginTop: 20 }}>
                        Channels
                    </Button>
                    <Button as={Link} to="/allchats" className='button d-flex justify-content-center align-items-center' variant='success' style={{ borderBottom: '1px solid gray', marginTop: 20 }}>
                        Chats
                    </Button>
                    <Button className='button d-flex justify-content-center align-items-center' variant='success' style={{ borderBottom: '1px solid gray', marginTop: 20 }}>
                        Calls
                    </Button>
                </Container>
            </Navbar>
        </Container>
    );
}