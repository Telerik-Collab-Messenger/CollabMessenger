import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../state/auth.context';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log(user.handle);
  console.log(user.email);

  const handleLogout = async () => {
    try {
      await logout();
      alert('User logged out successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      alert(error.message);
    }
  };
        
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
                            {!user.photoURL && <img id="pfp" src="../../../img/defaultUser.jpg"/>}
                            {user.handle}
                        </>
                    }
                >
                <Dropdown.Item variant="success" onClick={handleLogout}>Logout</Dropdown.Item>
              </DropdownButton>
            )} 
            </Container>
          </Navbar>
        );
}