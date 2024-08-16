import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../state/app.context';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


export default function Header() {
    const { user, setAppState } = useContext(AppContext);

    const logout = async () => {
        setAppState({ user: null, userData: null });
        navigate('/');
      };

    const navigate = useNavigate();
        
        return (
          <Navbar fixed="top" expand="lg" variant="dark" bg="dark">
            <Container>
              <Navbar.Brand id="brand-name">Better Teams</Navbar.Brand>
              {/* {user && ( */}
              <DropdownButton
                    id="dropdown-btn"
                    variant="success"
                    title={
                        <>
                            <img id="pfp" src="../../../img/defaultUser.jpg"/>
                            User
                        </>
                    }
                >
                <Dropdown.Item variant="success" onClick={logout}>Logout</Dropdown.Item>
              </DropdownButton>{" "}
              {/*  )} */}
            </Container>
          </Navbar>
        );
}