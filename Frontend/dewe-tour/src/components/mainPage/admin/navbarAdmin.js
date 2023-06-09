import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Image from 'react-bootstrap/Image';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

import admin from './admin.png';

function NavbarAdmin() {
    const imageNav = <div><Image roundedCircle height='50' width='50' src={admin} alt='user'/></div>

    function Logout() {
        localStorage.removeItem('token')
    }

    return (
        <>
        <Navbar className='NavbarRightUser'>
            <Container className='ContPadZ'>
                    <DropdownButton title={imageNav}>
                        <Dropdown.Item>
                                <Link style={{textDecoration:'none', color:'black'}} to="/admin">
                                <span className="fa-solid fa-map-pin" style={{color: '#88f231', marginRight:'20px'}}></span>
                                    Trip
                                </Link>
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={Logout} href='/'>
                        <span className="fa-solid fa-right-from-bracket" style={{color: "#ff4000", marginRight:'10px'}}></span>Logout
                        </Dropdown.Item>
                    </DropdownButton>
            </Container>
        </Navbar>
        </>
    )
}

export default NavbarAdmin