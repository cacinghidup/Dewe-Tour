import { useQuery } from '@tanstack/react-query';
import { Button, Form } from 'react-bootstrap';
import { API } from '../../config/api';
import { setAuthToken } from '../../config/api';
import { useMutation } from '@tanstack/react-query';

import { useState } from 'react';
import axios from 'axios';
import { redirect, useNavigate } from 'react-router-dom';

function AddTrip() {
    let navigate = useNavigate();

    const { data: countries } = useQuery(['countryCache'], async () => {
        const response = await axios.get('https://api.jsonbin.io/v3/b/6482b973b89b1e2299ac256b', {
            headers: {
                'X-Master-Key': '$2b$10$ncqipUJmEKE58ZpJFcNnyeBz8iWRz.ARGxQ8JJloLkXfY1tjlAlae',
            }
        });
        // console.log("surya ganteng",response.data.record)
        return response.data.record;
    });

    const [form, setForm] = useState({
        title: '',
        country: '',
        accomodation: '',
        transportation: '',
        eat: '',
        day: '',
        night: '',
        date_trip: '',
        price: '',
        quota: '',
        description: '',
        image:'',
    })

    console.log(form)

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.id]: e.target.type === 'file' ? e.target.files : e.target.value
        });
    };

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            setAuthToken(localStorage.token);

            const config = {
                headers: {
                    'Content-type': 'multipart/form-data',
                }
            }

            const formData = new FormData();
            formData.set('title', form.title);
            formData.set('country', form.country);
            formData.set('accomodation', form.accomodation);
            formData.set('transportation', form.transportation);
            formData.set('eat', form.eat);
            formData.set('day', form.day);
            formData.set('night', form.night);
            formData.set('date_trip', form.date_trip);
            formData.set('price', form.price);
            formData.set('quota', form.quota);
            formData.set('description', form.description);
            formData.append('uploadImage', form.image[0], form.image[0].name);

            const response = await API.post('/trips', formData, config);

            console.log("Berhasil Add Trip : ", response)
            console.log("Data : ", formData)

            navigate('/admin')

         } catch (err) {
            console.log("Gagal Add Trip :", err)
        }
    });


    return (
        <>
        <div className='BgAddTrip'>
            <div>
                <div>
                    <h3 className='mb-4'> Add Trip </h3>
                </div>
                <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Title Trip</Form.Label>
                        <Form.Control 
                            id="title" 
                            type="text"
                            onChange={handleChange}
                            value={form.title}
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>
                            Country
                        </Form.Label>
                        <select className="form-select" id="country" onChange={handleChange}>
                        {countries?.map((variant, index) => (
                            <option key={index + 1}> {variant?.country} </option>
                        ))}
                        </select>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Accomodation</Form.Label>
                        <Form.Control 
                            id="accomodation" 
                            type="text"
                            onChange={handleChange}
                            value={form.accomodation}
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Transportation</Form.Label>
                        <Form.Control 
                            id='transportation' 
                            type="text"
                            onChange={handleChange}
                            value={form.transportation}
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Eat</Form.Label>
                        <Form.Control 
                            id='eat' 
                            type="text"
                            onChange={handleChange}
                            value={form.eat}
                        /> 
                    </Form.Group>
                    <Form.Group className='row mx-1 mb-3'>
                        <Form.Label>Duration</Form.Label>
                        <Form.Control 
                            className='col' 
                            type="number" 
                            id='day'
                            onChange={handleChange}
                            value={form.day}/>
                        <Form.Label className='d-flex col align-items-center'>Day</Form.Label>
                        <Form.Control 
                            className='col' 
                            type="number" 
                            id='night'
                            onChange={handleChange}
                            value={form.night}/>
                        <Form.Label className='d-flex col align-items-center'>Night</Form.Label>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Date Trip</Form.Label>
                        <Form.Control 
                            id='date_trip'
                            type="date"
                            onChange={handleChange}
                            value={form.date_trip}
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Price</Form.Label>
                        <Form.Control 
                            id='price' 
                            type="number"
                            onChange={handleChange}
                            value={form.price}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Quota</Form.Label>
                        <Form.Control 
                            id='quota' 
                            type="text"
                            onChange={handleChange}
                            value={form.quota}
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control 
                            id='description' 
                            type="text"
                            onChange={handleChange}
                            value={form.description}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control 
                            id='image' 
                            type="file" 
                            required 
                            onChange={handleChange} />
                    </Form.Group>

                    <div className='d-flex justify-content-center mt-5'>
                        <Button variant="warning" type="submit" style={{width:'35%'}}>
                            Submit
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
        </>
    )
}

export default AddTrip