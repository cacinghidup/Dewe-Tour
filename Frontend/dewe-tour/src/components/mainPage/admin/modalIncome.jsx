import { Modal } from "react-bootstrap";


function ModalIncome({show, handleClose, params}) {

    const { data: order } = useQuery(['detailIncomeCache'], async () => {
        const response = await API.get('/transaction/' + params);
        return response.data.data;
    });

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton onClick={handleClose}>
                    <Modal.Title>Income</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                <div className="BgPayment">
                <div className="PaymentCard">
                    <div className="pt-3 px-5">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <Image src={iconPayment}/>
                            </div>
                            <div className="d-flex row align-items-center w-25">
                                <div>
                                    <h3 className="text-center"> Booking </h3>
                                </div>
                                <div>
                                    <p className="text-center">  </p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-evenly mt-3">
                            <div>
                                <div>
                                    <h2> {order?.Trip?.title} </h2>
                                </div>
                                <div>
                                    <p>  {order?.Trip?.country} </p>
                                </div>
                                <div>
                                    <p className="btn btn-outline-danger mt-4" style={{cursor:'default'}}> {order?.status} </p>
                                </div>
                            </div>
                            <div className="InfoTrip">
                                <div className="m-3">
                                    <h5> Date Trip </h5>
                                    <p> {order?.Trip?.dateTrip} </p>
                                </div>
                                <div className="m-3">
                                    <h5> Duration </h5>
                                    <p> {order?.Trip?.day} Day {order?.Trip?.night} Night </p>
                                </div>
                                <div className="m-3">
                                    <h5> Accomodation </h5>
                                    <p> {order?.Trip?.accomodation} </p>
                                </div>
                                <div className="m-3">
                                    <h5> Transportation </h5>
                                    <p> {order?.Trip?.transportation} </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-0">
                        <Table className="mt-3 mb-0">
                            <thead>
                                <tr>
                                <th className="text-center">No</th>
                                <th >Full Name</th>
                                <th></th>
                                <th>Phone</th>
                                <th></th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td className="text-center"> {user?.user_id} </td>
                                <td> {user?.name} </td>
                                <td></td>
                                <td> {user?.phone} </td>
                                <td>Qty : </td>
                                <td> {user?.Transaction[(user.Transaction.length - 1)]?.counter_qty} </td>
                                </tr>
                                <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td> Total : </td>
                                <td> IDR {user?.Transaction[(user.Transaction.length - 1)]?.total}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
                                         </div>

                </Modal.Body>
            </Modal>
        </>
    )
}

export default ModalIncome