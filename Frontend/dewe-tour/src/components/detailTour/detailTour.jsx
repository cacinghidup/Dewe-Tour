import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import { Link, useParams } from "react-router-dom";
import { API, setAuthToken } from "../config/api";
import jwtDecode from "jwt-decode";


function DetailTourism({toParent, statusUser}) {
  const [showModalAlert, setshowModalAlert] = useState(false)
  const hidden = (data) => setshowModalAlert(data)

  const params = useParams('id')
  
  const { data: tour } = useQuery(['tourDetailsCache'], async () => {
    const response = await API.get('/trip/' + params.id);
    return response.data.data;
  });

  const pathFile = "http://localhost:5005/"
  
  const toIdr = tour?.price.toLocaleString()
  
  const [pax, setPax] = useState(1)
  const [price, setPrice] = useState(tour?.price)

  const idRole = localStorage.getItem('token')
  
  const [form, setForm] = useState({
    counter_qty: pax,
    total: price,
    trip_id: params.id,
    status: "Waiting Payment",
    attachment: "bca.jpg",
    user_id: jwtDecode(idRole).id,
  })
  
  useEffect (() => {  
    setPrice(() => tour?.price * pax)// eslint-disable-next-line
    
    if (pax === 0) {
      // eslint-disable-next-line
      setPax((y) => y + 1)
      return alert('Pemesanan tidak boleh kurang dari 0')
    }
    
    if (pax > tour?.quota) {
      setPax((y) => y - 1)
      return alert('Pemesanan tidak boleh lebih dari sisa paket yang ada')
    }

    setForm({
      counter_qty: pax,
      total: (tour?.price * pax),
      trip_id: parseInt(params.id),
      status: "Waiting Payment",
      attachment: "bca.jpg",  
      user_id: jwtDecode(idRole).id,
    });
    // eslint-disable-next-line
  }, [pax])

  const handleSubmit = useMutation(async (e) => {
    try{
      e.preventDefault()

      setAuthToken(localStorage.token);


      // const formToJSON = JSON.stringify(form)
    
      // Configuration
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      // Insert data for login process, you can also make this without any configuration, because axios would automatically handling it.
      const response = await API.post('/transaction', form, config );

      console.log("Berhasil Update Payment", response)

      // toParent({Prove: false})
      
    }
    catch(error){
      console.log("Gagal Input Transaksi", error)
    }
  })

  useEffect(() => {
    window.scrollTo(0,0)
  }, [])
    
  function checkIfNotLogin() {
    if (statusUser === false) {
      setshowModalAlert(true)
    }
  }

  return (
    <div className="bg-light p-5">
        <div>
            <h1 className="HeaderDetail">{tour?.title}</h1>
            <h5 className="HeaderDetail">{tour?.country}</h5>
        </div>
      <Carousel interval={null}>
        <Carousel.Item>
          <img
            className="CarouselTour"
            src={pathFile + (tour?.image)}
            alt="First"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="CarouselTour"
            src={tour?.image}
            alt="Second"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="CarouselTour"
            src={tour?.image}
            alt="Third"
          />
        </Carousel.Item>
      </Carousel>
      {/* <Container>
        <Row className="mt-3">
          <Col>
            <Image className="shadow-lg w-100 h-100" src={tour?.image} thumbnail/>
          </Col>
          <Col>
            <Image className="shadow-lg w-100 h-100" src={tour?.image} thumbnail/>
          </Col>
          <Col>
            <Image className="shadow-lg w-100 h-100" src={tour?.image} thumbnail/>
          </Col>
        </Row>
      </Container> */}
      <div className="InnerDetail pt-5">
        <h5> Informartion Trip </h5>
        <div className="mt-4 d-flex col justify-content-around">
          <div>
            <p className="mb-1">Accomodation</p>
            <h5> <span className="fa-solid fa-hotel"></span> {tour?.accomodation} </h5>
          </div>
          <div>
            <p className="mb-1">Transportation</p>
            <h5> <span className="fa-solid fa-plane"></span> {tour?.transportation} </h5>
          </div>
          <div>
            <p className="mb-1">Eat</p>
            <h5> <span className="fa-solid fa-utensils"></span> {tour?.eat} </h5>
          </div>
          <div>
            <p className="mb-1">Duration</p>
            <h5> <span className="fa-solid fa-clock"></span> {tour?.day} Day {tour?.night} Night </h5>
          </div>
          <div>
            <p className="mb-1">Date Trip</p>
            <h5> <span className="fa-solid fa-calendar-days"></span> {tour?.dateTrip} </h5>
          </div>
        </div>
        <div className="mt-5">
          <div>
            <h5> Description </h5>
          </div>
          <div>
            <p style={{textAlign:'justify'}}> {tour?.description} </p>
          </div>
          <div>
            <h5> Available Tour =  {tour?.quota} </h5>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center"> 
          <div>
            <h3 className="ColorPrice">
              IDR. {toIdr} <span style={{color:'black'}}> / Person </span>
            </h3>
          </div>
          <div>
              <h4><span 
                  className="fa-solid fa-circle-minus mx-2" 
                  style={{color:'#f7c202', cursor:'pointer'}} 
                  onClick={() => setPax((y) => y - 1)}/> 
                    {pax} 
                  <span 
                  className="fa-solid fa-circle-plus mx-2" 
                  style={{color:'#f7c202', cursor:'pointer'}} 
                  onClick={() => setPax((y) => y + 1)}/>
              </h4>
          </div>
        </div>
        <hr/>
        <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3> Total : </h3>
        </div>
        <div>
          <h3 className="ColorPrice">
            IDR. {price}
          </h3>
        </div>
      </div>
      <hr/>
        
      { statusUser ? (
      <div className="d-flex justify-content-end align-items-center">
        <Link to={`/payment/${params.id}`}>
          <Button variant="warning" size="lg" type="submit" 
            onClick=
            {(e) => handleSubmit.mutate(e)
                }>Book Now</Button>
        </Link>
      </div> 
      ) : (
      <div className="d-flex justify-content-end align-items-center">
        <Button variant="warning" size="lg" type="submit" onClick={checkIfNotLogin}> Book Now</Button> 
      </div>
      )}
      </div>
      <Modal centered show={showModalAlert} onHide={() => hidden(false)}>
        <Modal.Body>
          <h4 style={{textAlign:'center'}}> Mohon Login Untuk Melanjutkan Booking </h4>
        </Modal.Body>
      </Modal>
    </div>
    )
}

export default DetailTourism