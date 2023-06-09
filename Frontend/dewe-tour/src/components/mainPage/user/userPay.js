import { useQuery } from "@tanstack/react-query";
import jwtDecode from "jwt-decode";
import { API } from "../../config/api";
import { Image } from 'react-bootstrap';
import iconPayment from '../../payment/IconPaymentCard.png';
import {Table} from "react-bootstrap";
import ButtonPay from "../../payment/buttonPay";

function UserPay() {

    const idRole = localStorage.getItem('token')
    const id = jwtDecode(idRole)

    const { data: userProfile } = useQuery(['userProfileCache'], async () => {
        const response = await API.get('/user/' + id.id);
        return response.data.data;
    });

    const data1 =  userProfile?.Transaction.filter((Transaction) => {
        // eslint-disable-next-line
        return Transaction.status == 'Waiting Payment'
    })

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
                {/* <Link style={{textDecoration:'none', cursor:'pointer'}} to={`/paymentSuccess/${params.id}`}> */}
                <div>
                    <ButtonPay/>
                </div>
                {/* </Link> */}
                {/* <ModalPayment show={showMod} hideMod={hidden} param={(params.id)} prove={proved}/> */}
            </div>
            ))}
                </div>
        </div>
    )
}

export default UserPay