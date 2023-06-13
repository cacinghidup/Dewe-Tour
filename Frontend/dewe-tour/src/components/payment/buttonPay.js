import Button from "react-bootstrap/esm/Button"

function ButtonPay() {

    return (
        <div className="d-flex justify-content-end my-5">
            <Button variant="warning" size="lg" type="submit" > Pay Now </Button>
        </div>
    )
}
function ButtonDeleteBooking() {

    return (
        <div className="d-flex justify-content-end my-5">
            <Button variant="danger" size="lg" type="submit" > Delete Booking </Button>
        </div>
    )
}

export {ButtonPay, ButtonDeleteBooking}