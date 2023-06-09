import { Image } from 'react-bootstrap'
import Leaf from './leaf.png'

function Footer() {
    return (
        <>
        <div style={{position:'absolute', bottom:'0', width:'100%'}}>
            <div className="card card-footer text-body-secondary FooterMain">
                Copyright @ 2023 Dewe Tour - Mas Jhon Doe - NIS. All Rights reserved
            </div>
            <Image style={{position:'absolute', right:'0', top:'-103px'}} src={Leaf}/>
        </div>
        </>
    )
}

export default Footer