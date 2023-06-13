import Image from "react-bootstrap/esm/Image";
import iconPayment from './IconPaymentCard.png';

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import { redirect, useParams } from "react-router-dom";
import { API, setAuthToken } from "../config/api";
import {ButtonPay} from "./buttonPay";
import ModalPayment from "./modalPayment";
import jwtDecode from "jwt-decode";

function Payment() {
    const params = useParams('id')
    const idRole = localStorage.getItem('token')
    const id = jwtDecode(idRole)

    const [prove, setProve] = useState(false)
    const proved = (data) => setProve(data)

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
    });

    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        //change this according to your client-key
        const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;
    
        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    
        document.body.appendChild(scriptTag);
        return () => {
          document.body.removeChild(scriptTag);
        };
    }, []);

    function ShowModal(e) {
        handleBuy.mutate(e)
        proved(true)
    }

    const handleBuy = useMutation(async (e) => {
        try {
          e.preventDefault();

          setAuthToken(localStorage.token);
    
          const config = {
            headers: {
              'Content-type': 'application/json',
            },
          };
    
          const data = {
            id: user?.Booking[(user.Booking.length - 1)].id,
            counter_qty : user?.Booking[(user.Booking.length - 1)].counter_qty,
            total : user?.Booking[(user.Booking.length - 1)].total,
            status : user?.Booking[(user.Booking.length - 1)].status,
            attachment : user?.Booking[(user.Booking.length - 1)].attachment,
            trip_id : user?.Booking[(user.Booking.length - 1)].trip_id,
            user_id : user?.user_id        
        };
    
          const body = JSON.stringify(data);

          const response = await API.post('/transaction', body, config);
          console.log("transaction success :", response)
    
          const token = response.data.data.token;
          window.snap.pay(token, {
            onSuccess: function (result) {
              /* You may add your own implementation here */
              console.log(result);
              redirect("/userProfile");
            },
            onPending: function (result) {
              /* You may add your own implementation here */
              console.log(result);
              redirect("/userProfile");
            },
            onError: function (result) {
              /* You may add your own implementation here */
              console.log(result);
              redirect("/userProfile");
            },
            onClose: function () {
              /* You may add your own implementation here */
              alert("you closed the popup without finishing the payment");
            },
          });

          await API.delete('/booking/' + user?.Booking[(user.Booking.length - 1)].id)

        } catch (error) {
          console.log("transaction failed : ", error);
        }
    });

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
                                    <p className="btn btn-outline-danger mt-4" style={{cursor:'default'}}> {(user?.Booking[(user.Booking.length - 1)]?.status)} </p>
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
                                <td> {user?.Booking[(user.Booking.length - 1)]?.counter_qty} </td>
                                </tr>
                                <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td> Total : </td>
                                <td> IDR {user?.Booking[(user.Booking.length - 1)]?.total}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div onClick={ShowModal}>
                    {prove ? (<></>) : (<ButtonPay/>)}
                </div>
                {/* <ModalPayment show={showMod} hideMod={hidden} param={(params.id)} prove={proved}/> */}
            </div>
        </>
    )
}

export default Payment