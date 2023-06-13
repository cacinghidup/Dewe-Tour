import Table from "react-bootstrap/esm/Table";

import { useQuery } from "@tanstack/react-query";
import { API } from "../../config/api";
import ModalIncome from "./modalIncome";
import { useEffect, useState } from "react";

function HomeAdmin() {
    const { data: order } = useQuery(['tourCache'], async () => {
        const response = await API.get('/orders');
        return response.data.data;
    },{
        refetchInterval: 1000,
        refetchIntervalInBackground: true,
    });

    console.log(order)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    
    const [param, setParam] = useState(null);

    function handleClick(id) {
        setShow(true)
        setParam(id)
    }
 
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
                        {order?.map((variant, index) => (
                    <tbody>
                        <tr key={variant?.id}>
                        <td className="text-center">{(index + 1)}</td>
                        <td>{variant.User?.name}</td>
                        <td>{variant.Trip?.title}</td>
                        <td>{variant.status}</td>
                        <td style={{cursor:'pointer'}}  className="text-center"><i onClick={() => handleClick(variant.id)} className="fa-solid fa-magnifying-glass"/>
                        </td>
                        </tr>
                    </tbody>
                        ))}
                        <ModalIncome show={show} handleClose={handleClose} params={param}/>
                </Table>
            </div>

        </div>

    )
}

export default HomeAdmin