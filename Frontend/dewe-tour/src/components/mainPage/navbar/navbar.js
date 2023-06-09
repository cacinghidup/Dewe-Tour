import { useState } from 'react';
import ModalLogin from '../login/login';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Navbar from 'react-bootstrap/Navbar';
import ModalRegister from '../register/register';
import logo from './logo.png';
import NavbarLogin from './navbarAfterLogin';
import NavbarAdmin from '../admin/navbarAdmin';

function NavigasiBar({user, statusUser, userAdmin, statusAdmin}) {
    const [showLog, setShowLog] = useState(false);
    const [showReg, setShowReg] = useState(false);
    const setReq = (data1) => setShowReg(data1)
    const setLogAfterFail = (data) => setShowLog(data)

    const closePopUpReg = () => setShowReg(false);

    return (
        <>
        <Navbar expand="md" variant="light" className='MainNav d-flex justify-content-between'>
            <Navbar className='NavbarLeft'>
                <Container>
                    <a href='/'>
                        <Image style={{marginLeft: '60px'}} className='Text' src={logo} alt='logo'/>
                    </a>
                </Container>
            </Navbar>
            {statusUser ? (<NavbarLogin/>) : statusAdmin ? (<NavbarAdmin/>) : (
                <Navbar className='NavbarRight'>
                <Container className='ContPadZ'>
                    <Button variant='light' className='Text Button' onClick={() => setShowLog(true)}>Login</Button>
                </Container>
                <Container className='ContPadZ'>
                    <Button variant='light' className='Text ButtonReg' onClick={() => setShowReg(true)}>Register</Button>
                </Container>
                </Navbar>
            )}
        </Navbar>
        <ModalLogin show={showLog} hidden={setLogAfterFail} user={user} userAdmin={userAdmin} showReg={setReq}/>
        <ModalRegister show={showReg} hidden={closePopUpReg}/>
        </>
    )
}

export default NavigasiBar