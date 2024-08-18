import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { logoutUser } from '../../services/authenticate-service';
import { AppContext } from '../../state/app.context';



export default function Header() {
    const { user, userData, setAppState } = useContext(AppContext);
    const navigate = useNavigate();
    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
        navigate('/');
    };
    const detailUser = () => {
        navigate('userdetails');
      }

    return (
        <Navbar fixed="top" expand="lg" variant="dark" bg="dark">
            <Container>
                <Navbar.Brand id="brand-name">Better Teams</Navbar.Brand>
                {user && (
                    <DropdownButton
                        id="dropdown-btn"
                        variant="success"
                        title={
                            <>
                                {/* <img id="pfp" src="../../../img/defaultUser.jpg"/> */}
                                {<img id="pfp" src="../../../img/defaultUser.jpg" />}
                                {userData && <span>Welcome, {userData.handle}</span>}
                            </>
                        }
                    >
                        <Dropdown.Item variant="success" onClick={detailUser}>Details</Dropdown.Item>
                        <Dropdown.Item variant="success" onClick={logout}>Logout</Dropdown.Item>
                    </DropdownButton>
                )}
            </Container>
        </Navbar>
    );
}