import './Logged.css'
import { Container, Navbar, Button } from "react-bootstrap";

export default function Logged() {
    
    return (
        <Container id="navbar-container">
            <Navbar id='navbar' className="d-flex flex-column" expand="lg" variant="dark" bg="light" fixed="center" >
                <Container id='button-container' style={{ marginTop: 20 }} className="d-flex flex-column">
                    <Button className='button d-flex justify-content-center align-items-center' variant='success' style={{ borderBottom: '1px solid gray', marginTop: 20 }}>Channels</Button>
                    <Button className='button d-flex justify-content-center align-items-center' variant='success' style={{ borderBottom: '1px solid gray', marginTop: 20 }}>Chats</Button>
                    <Button className='button d-flex justify-content-center align-items-center' variant='success' style={{ borderBottom: '1px solid gray', marginTop: 20 }}>Calls</Button>
                </Container>
            </Navbar>
        </Container>
    )
}