import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function SearchBar() {
    return(
        <Form.Group className="m-5">
          <Form.Label className='TextSearch'> Find Great Place to Holiday</Form.Label>
          <InputGroup className='input-group-lg'>
            <Form.Control
              placeholder="Search"
              aria-label="Search"
              aria-describedby="basic-addon2"
            />
            <Button variant="outline-secondary" id="button-addon2" className='ButtonSearch'>
              Search
            </Button>
          </InputGroup>
        </Form.Group>
    )
}

export default SearchBar