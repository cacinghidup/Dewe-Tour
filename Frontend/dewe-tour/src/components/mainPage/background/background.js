import { Image } from 'react-bootstrap';
import background from './beach.png';
import Hibiscus from './hibiscus.png';
import Palm from './palm.png'

function BackgroundImage() {
    return (
        <div style={{position:'relative'}}>
            <img src={background} className='Background-image' alt='background'/>
            <Image style={{position:'absolute', right:'0', bottom:'-800px'}} src={Hibiscus}/>
            <Image style={{position:'absolute', bottom:'-1100px'}} src={Palm}/>
        </div>
    )
}

export default BackgroundImage