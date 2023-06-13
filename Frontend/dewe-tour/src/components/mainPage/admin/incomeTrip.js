import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { API } from '../../config/api';
import { useMutation } from '@tanstack/react-query';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';


function IncomeTrip() {

    const [showModalAlert, setshowModalAlert] = useState(false)
    const closeModal = () => setshowModalAlert(false)
    const openModal = () => setshowModalAlert(true)

    const [showModalAlertDelete, setshowModalAlertDelete] = useState(false)
    const closeModalDelete = () => setshowModalAlertDelete(false)
    const openModalDelete = () => setshowModalAlertDelete(true)

    // const [showModalAlertEmpty, setshowModalAlertEmpty] = useState(false)
    // const closeModalEmpty = () => setshowModalAlertEmpty(false)
    // const openModalEmpty = () => setshowModalAlertEmpty(true)

    // const [emptyStock, setemptyStock] = useState(false)
    // const handleEmpty = () => setemptyStock(true)
    
    const { data: tour } = useQuery(['tripsCache'], async () => {
        const response = await API.get('/trips');
        return response.data.data;
    }, {
        refetchInterval: 1000,
        refetchIntervalInBackground: true,
    });

    const { data: order } = useQuery(['orderanCache'], async () => {
        const response = await API.get('/orders');
        return response.data.data;
    });
    
    function checkIfAnyTransacation(ids) {
        if (order?.length > 0 && order?.trip_id === tour?.id) {
            openModal()
        } else if (order?.length === 0) {
            openModalDelete()
            handleDelete.mutate(ids)
        }
    }

    // const data1 =  tour?.filter((quota) => {
    //     // eslint-disable-next-line
    //     return tour?.quota === 0
    // })

    // console.log(data1)

    // if (tour?.quota === 0) {
    //     handleEmpty()
    //     openModalEmpty()
    // }

    const handleDelete = useMutation(async (id) => {
       try {
           await API.delete(`/trip/${id}`);
           console.log("Berhasil Menghapus",id);
       } catch (error) {
           console.log("Gagal Menghapus",error);
       }
    });

    return (
        <>
        <div className='IncomeTrip'>
            <div className='d-flex justify-content-between px-5'>
                <div>
                    <h2> List Trip </h2>
                </div>
                <div>
                    <Link to='/admin/trip'>
                        <Button variant='warning' type='button'> Add Trip </Button>
                    </Link>
                </div>
            </div>
            <div className='GridGroupTour'>
                {tour?.map((variant) => (
                    <div className='col p-0 m-2' key={variant.id}>
                    <Card className='GroupCard p-2 my-4'>
                        <div style={{position:'relative'}}>
                            <div>
                                <Card.Img className='GroupCardImage' variant="top" src={variant?.image}/>
                            </div>
                            <div>
                                <p style={{position:'absolute', top:'30px', right:'0', backgroundColor:'white', padding:'5px', borderRadius:'5px 0px 0px 5px'}}> Available Tour : {variant.quota} </p>
                            </div>
                        </div>
                        <Card.Body className='row d-flex justify-content-start m-0 p-0 w-100' style={{textAlign:'center'}}>
                        <Card.Title className='pt-2 GroupCardTitle' style={{color: 'black'}}>{variant.title}</Card.Title>
                        <div className='GroupCardPrice mt-2 mb-0 d-flex justify-content-between'>
                            <Card.Text style={{color: 'black'}}>
                                IDR {(variant.price)?.toLocaleString()}
                            </Card.Text>
                            <Card.Text style={{color: 'black'}}>
                                {variant.country}
                            </Card.Text>
                        </div>
                        <div className='justify-content-end d-flex w-100 h-0'>
                            <Button onClick={() => checkIfAnyTransacation(variant?.id)} variant='danger' type='button'> Delete </Button>
                        </div>
                        </Card.Body>
                    </Card>
                    </div>
                ))}
            </div>
            <Modal show={showModalAlert} onHide={closeModal} centered>
                <Modal.Header>
                    <Modal.Title>Status Delete Trip</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <p>Trip tidak bisa dihapus, sedang ada order ya gaes ya..</p>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={showModalAlertDelete} onHide={closeModalDelete} centered>
                <Modal.Header>
                    <Modal.Title>Status Delete Trip</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <p>Berhasil Menghapus Trip</p>
                    </div>
                </Modal.Body>
            </Modal>
            {/* <Modal show={showModalAlertEmpty} onHide={closeModalEmpty} centered>
                <Modal.Header>
                    <Modal.Title>Status Trip</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <p>Punten Bosku, ada trip yang sudah habis, tolong update quota nya..</p>
                    </div>
                    {data1?.map((variant) => (                    
                        <div key={variant?.id}>
                            <p> Trip : {variant?.title} Kosong!!! </p>
                        </div>
                    ))} 
                </Modal.Body>
            </Modal> */}
        </div>
        </>
    )
}

export default IncomeTrip