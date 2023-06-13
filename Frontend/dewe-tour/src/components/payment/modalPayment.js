import { Modal } from "react-bootstrap"
import { Link } from "react-router-dom"

function ModalPayment({show, hideMod, param}) {

    function modalPayment() {
        hideMod(false)
    }

    return (
        <>
        <Modal show={show} onHide={hideMod} centered>
            <Modal.Body>
                <Link style={{textDecoration:'none', cursor:'pointer'}} to={`/paymentSuccess/${param}`}>
                <h6 style={{textAlign:'center', color:'black'}} onClick={modalPayment}>Your payment will be confirmed within 1 x 24 hours
                To see orders click Here thank you</h6>
                </Link>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default ModalPayment