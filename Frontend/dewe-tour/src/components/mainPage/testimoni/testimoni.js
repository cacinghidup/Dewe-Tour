import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import agent from './agent.png';
import guarantee from './guarantee.png';
import heart from './heart.png';
import support from './support.png';

function TestimoniCard() {
    const Data = [
        {
          Id:0,
          Title: 'Best Price Guarantee',
          Content: 'A small river named Duren flows by their place and supplies',
          Image: agent,
        },
        {
          Id:1,
          Title: 'Travellers Love Us',
          Content: 'A small river named Duren flows by their place and supplies',
          Image: guarantee,
        },
        {
          Id:2,
          Title: 'Best Travel Agent',
          Content: 'A small river named Duren flows by their place and supplies',
          Image: heart,
        },
        {
          Id:3,
          Title: 'Our Dedicated Support',
          Content: 'A small river named Duren flows by their place and supplies',
          Image: support,
        }
      ];
      return (
        <>
        <div className='TestiCardDirection'>
        {Data.map((data) => (
        <Row key={data.Id}>
            <Col>
              <Card className='TestiCard'>
                <Card.Img className='TestiCardImage' variant="top" src={data.Image}/>
                <Card.Body className='row d-flex justify-content-start' style={{textAlign:'center'}}>
                  <Card.Title className='pt-2' style={{color: 'black'}}>{data.Title}</Card.Title>
                  <Card.Text style={{color: 'black'}}>
                    {data.Content}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
        </Row>
        ))}
        </div>
        </>
    )
}

export default TestimoniCard