import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Image from 'react-bootstrap/Image';
import Navbar from 'react-bootstrap/Navbar';

import userPic from '../user/user.png';
import { Link } from 'react-router-dom';




function NavbarLogin() {

    function Logout() {
        localStorage.removeItem('token')
    }
    
    const imageNav = <div><Image roundedCircle height='50' width='50' src={userPic} alt='user'/></div>

    return (
        <>
        <Navbar className='NavbarRightUser'>
            <Container className='ContPadZ'>
                    <DropdownButton title={imageNav}>
                        <Dropdown.Item>
                            <Link style={{textDecoration:'none', color:'black'}} to='/userProfile'>
                            <span className="fa-regular fa-user" style={{color: '#ffd500', marginRight:'10px'}}></span>Profile
                            </Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Link style={{textDecoration:'none', color:'black'}} to='/userPayment'>
                            <span className="fa-solid fa-file-invoice-dollar" style={{color: '#38943a', marginRight:'10px'}}/>Pay
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

export default NavbarLogin