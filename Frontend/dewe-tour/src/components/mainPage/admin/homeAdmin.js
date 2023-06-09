import Table from "react-bootstrap/esm/Table";

import { useQuery } from "@tanstack/react-query";
import { API } from "../../config/api";
import ModalIncome from "./modalIncome";
import { useState } from "react";

function HomeAdmin() {
    const { data: order } = useQuery(['tourCache'], async () => {
        const response = await API.get('/orders');
        return response.data.data;
    }, {
        refetchInterval: 1000,
        refetchIntervalInBackground: true,
    });

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="HomeAdmin">
            <div>
                <h2 style={{marginBottom:'25px'}}>Incoming Transaction</h2>
            </div>
            <div>
                <Table striped bordered hover className="mt-3 mb-0">
                    <thead>
                        <tr>
                        <th className="text-center">No</th>
                        <th>Users</th>
                        <th>Trip</th>
                        <th>Status Payment</th>
                        <th className="text-center">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order?.map((variant, index) => (
                        <tr>
                        <td className="text-center">{(index + 1)}</td>
                        <td>{variant.User?.name}</td>
                        <td>{variant.Trip?.title}</td>
                        <td>{variant.status}</td>
                        <td className="text-center"><i onClick={handleShow} class="fa-solid fa-magnifying-glass"/>
                        <ModalIncome show={show} handleClose={handleClose} params={variant?.id}/>
                        </td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

        </div>

    )
}

export default HomeAdmin