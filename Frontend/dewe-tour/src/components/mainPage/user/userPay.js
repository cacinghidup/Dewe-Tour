import { useQuery } from "@tanstack/react-query";
import jwtDecode from "jwt-decode";
import { API } from "../../config/api";
import { Image } from 'react-bootstrap';
import iconPayment from '../../payment/IconPaymentCard.png';
import {Table} from "react-bootstrap";
import {ButtonPay, ButtonDeleteBooking } from "../../payment/buttonPay";
import { setAuthToken } from "../../config/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { redirect } from "react-router-dom";
function UserPay() {

    const idRole = localStorage.getItem('token')
    const id = jwtDecode(idRole)

    setAuthToken(localStorage.token);

    const { data: userProfile } = useQuery(['userProfileCache'], async () => {
        const response = await API.get('/user/' + id.id);
        return response.data.data;
    });

    const data1 =  userProfile?.Booking.filter((Booking) => {
        // eslint-disable-next-line
        return Booking.status == 'Waiting Payment'
    })

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
            id: userProfile?.Booking[(userProfile.Booking.length - 1)].id,
            counter_qty : userProfile?.Booking[(userProfile.Booking.length - 1)].counter_qty,
            total : userProfile?.Booking[(userProfile.Booking.length - 1)].total,
            status : userProfile?.Booking[(userProfile.Booking.length - 1)].status,
            attachment : userProfile?.Booking[(userProfile.Booking.length - 1)].attachment,
            trip_id : userProfile?.Booking[(userProfile.Booking.length - 1)].trip_id,
            user_id : userProfile?.user_id        
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

          await API.delete('/booking/' + userProfile?.Booking[(userProfile.Booking.length - 1)].id)

        } catch (error) {
          console.log("transaction failed : ", error);
        }
    });

    return (
        <div className="BgPersonalInfo p-5">
            <div className="HistoryTripPayment">
                <div style={{marginLeft: '75px'}}>
                    <h3> Cart Trip </h3>
                </div>
            {data1?.map((variant) => (
            <div className="BgPaymentProfile mb-0" key={variant.id}>
                <div className="PaymentCard mb-0">
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
                                    <h2> {variant.Trip.title} </h2>
                                </div>
                                <div>
                                    <p>  {variant.Trip.country} </p>
                                </div>
                                <div>
                                    <p className="btn btn-outline-danger mt-4" style={{cursor:'default'}}> {variant.status} </p>
                                </div>
                            </div>
                            <div className="InfoTrip">
                                <div className="m-3">
                                    <h5> Date Trip </h5>
                                    <p> {variant.Trip.dateTrip} </p>
                                </div>
                                <div className="m-3">
                                    <h5> Duration </h5>
                                    <p> {variant.Trip.day} Day {variant.Trip.night} Night </p>
                                </div>
                                <div className="m-3">
                                    <h5> Accomodation </h5>
                                    <p> {variant.Trip.accomodation} </p>
                                </div>
                                <div className="m-3">
                                    <h5> Transportation </h5>
                                    <p> {variant.Trip.transportation} </p>
                                </div>
                            </div>
                            {/* {prove ? 
                            (<div>
                                <Image style={{height:'175px', width:'175px', marginRight:'35px'}} src={qrCode} thumbnail/>
                            </div>) 
                            : 
                            (<div>
                                <Image className="w-100 h-100" src={uploadPayment} thumbnail/>
                            </div>) } */}
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
                                <td className="text-center"> {variant.user_id} </td>
                                <td> {variant.User.name} </td>
                                <td></td>
                                <td> {variant.User.phone} </td>
                                <td>Qty : </td>
                                <td> {variant.counter_qty} </td>
                                </tr>
                                <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td> Total : </td>
                                <td> IDR {variant.total}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div>
                    <ButtonDeleteBooking/>
                </div>
                <div>
                    <ButtonPay/>
                </div>
            </div>
            ))}
                </div>
        </div>
    )
}

export default UserPay