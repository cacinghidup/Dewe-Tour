import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
// import DataLempar from '../../dataFake';
import { useQuery } from '@tanstack/react-query';
import { API } from '../../config/api';

function GroupTour() {

    const { data: tour } = useQuery(['tourCache'], async () => {
        const response = await API.get('/trips');
        return response.data.data;
    });
    
    return (
        <div className='GridGroupTour'>
            {tour?.map((variant) => (
                <div className='col p-0 m-2' key={variant.id}>
                <Card className='GroupCard p-2 my-4'>
                    <div style={{position:'relative'}}>
                        <div>
                            <Card.Img style={{height:'250px', width:'100%'}} className='GroupCardImage' variant="top" src={(variant.image)}/>
                        </div>
                        <div>
                            <p style={{position:'absolute', top:'30px', right:'0', backgroundColor:'white', padding:'5px', borderRadius:'5px 0px 0px 5px'}}> Available Tour : {variant.quota} </p>
                        </div>
                    </div>
                    <Card.Body className='row d-flex justify-content-start m-0 p-0' style={{textAlign:'center'}}>
                    <Link style={{textDecoration:'none', cursor:'pointer'}} to={`/detailTour/${variant.id}`}>
                      <Card.Title className='pt-2 GroupCardTitle' style={{color: 'black'}}>{variant.title}</Card.Title>
                    </Link>
                    <div className='GroupCardPrice mt-2 mb-0'>
                        <Card.Text style={{color: 'black'}}>
                            IDR {(variant.price).toLocaleString()}
                        </Card.Text>
                        <Card.Text style={{color: 'black'}}>
                            {variant.country}
                        </Card.Text>
                    </div>
                    </Card.Body>
                </Card>
                </div>
            ))}
        </div>
    )
}

export default GroupTour