import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { API } from '../../config/api';
import { useMutation } from '@tanstack/react-query';


function IncomeTrip() {
    
    const pathFile = "http://localhost:5005/"
    
    const { data: tour } = useQuery(['tripsCache'], async () => {
        const response = await API.get('/trips');
        return response.data.data;
    }, {
        refetchInterval: 1000,
        refetchIntervalInBackground: true,
    });
    // console.log("Income", tour)

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
                    <h2> Income Trip </h2>
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
                        <Card.Img className='GroupCardImage' variant="top" src={pathFile + (variant?.image)}/>
                        <Card.Body className='row d-flex justify-content-start m-0 p-0 w-100' style={{textAlign:'center'}}>
                        <Card.Title className='pt-2 GroupCardTitle' style={{color: 'black'}}>{variant.title}</Card.Title>
                        <div className='GroupCardPrice mt-2 mb-0 d-flex justify-content-between'>
                            <Card.Text style={{color: 'black'}}>
                                IDR {(variant.total)?.toLocaleString()}
                            </Card.Text>
                            <Card.Text style={{color: 'black'}}>
                                {variant.Country}
                            </Card.Text>
                        </div>
                        <div className='justify-content-end d-flex w-100'>
                            <Button onClick={() => handleDelete.mutate(variant?.id)} variant='danger' type='button'> Delete </Button>
                        </div>
                        </Card.Body>
                    </Card>
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}

export default IncomeTrip