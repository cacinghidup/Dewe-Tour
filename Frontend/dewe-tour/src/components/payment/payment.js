import Image from "react-bootstrap/esm/Image";
import iconPayment from './IconPaymentCard.png';

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Table from 'react-bootstrap/Table';
import { useParams } from "react-router-dom";
import { API, setAuthToken } from "../config/api";
import ButtonPay from "./buttonPay";
import ModalPayment from "./modalPayment";
import jwtDecode from "jwt-decode";

function Payment() {
    const params = useParams('id')
    const idRole = localStorage.getItem('token')
    const id = jwtDecode(idRole)

    const [prove, setProve] = useState(false)
    const proved = (data) => setProve(data)

    const[showMod, setshowMod] = useState(false)
    // const[hideMod, sethideMod] = useState(false)
    const hidden = (data1) => setshowMod(data1) 

    setAuthToken(localStorage.token);

    const { data: payment } = useQuery(['tourDetailCache'], async () => {
        const response = await API.get('/trip/' + params.id);
        return response.data.data;
    });


    const { data: user } = useQuery(['userPaymentCache'], async () => {
        const response = await API.get('/user/' + id.id);
        return response.data.data;
    }, {
        refetchInterval: 1000,
        refetchIntervalInBackground: true,
    }
    );

    const [form, setForm] = useState({
        status: '',
    })

    const updateForm = (data) => setForm(data)


    const handleSubmit = useMutation(async (e) => {
        try{
        e.preventDefault()

        setAuthToken(localStorage.token);

        // console.log(setAuthToken)

        // const formToJSON = JSON.stringify(form)
        
        // Configuration
        const config = {
            headers: {
            'Content-type': 'application/json',
            },
        };

        // Insert data for login process, you can also make this without any configuration, because axios would automatically handling it.
        const response = await API.patch('/transaction/' + user?.Transaction[(user.Transaction.length - 1)].id, form, config );

        console.log("Berhasil Update Status", response)

        fetch('/user/' + id)

        }
        catch(error){
        console.log("Gagal Input Status", error)
        }
    })

    function ShowModal(e) {
        setshowMod(true)
        updateForm({status: 'Waiting Approved'})
        handleSubmit.mutate(e)
        proved(true)
    }

    // console.log(user?.Transaction[(user.Transaction.length - 1)])

    return (
        <>
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
                                    <h2> {payment?.title} </h2>
                                </div>
                                <div>
                                    <p>  {payment?.country} </p>
                                </div>
                                <div>
                                    <p className="btn btn-outline-danger mt-4" style={{cursor:'default'}}> {(user?.Transaction[(user.Transaction.length - 1)]?.status)} </p>
                                </div>
                            </div>
                            <div className="InfoTrip">
                                <div className="m-3">
                                    <h5> Date Trip </h5>
                                    <p> {payment?.dateTrip} </p>
                                </div>
                                <div className="m-3">
                                    <h5> Duration </h5>
                                    <p> {payment?.day} Day {payment?.night} Night </p>
                                </div>
                                <div className="m-3">
                                    <h5> Accomodation </h5>
                                    <p> {payment?.accomodation} </p>
                                </div>
                                <div className="m-3">
                                    <h5> Transportation </h5>
                                    <p> {payment?.transportation} </p>
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
                <div onClick={ShowModal}>
                    {prove ? (<></>) : (<ButtonPay/>)}
                </div>
                <ModalPayment show={showMod} hideMod={hidden} param={(params.id)} prove={proved}/>
            </div>
        </>
    )
}

export default Payment