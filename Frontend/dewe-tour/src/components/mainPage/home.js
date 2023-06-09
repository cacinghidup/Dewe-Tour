import HeaderDewe from './header/header';
import SearchBar from './searchBar/searchBar';
import TestimoniCard from './testimoni/testimoni';
import HeaderGroupTour from './headerGroupTour/headerGroupTour';
import GroupTour from './groupTour/groupTour';
import { Navigate } from 'react-router-dom';

function HomePage({userAdmin}) {
    return (
        <>
        {userAdmin ? (<Navigate to='/homeAdmin'/>) : (
            <>
                <HeaderDewe/>
                <SearchBar/>
                <TestimoniCard/>
                <HeaderGroupTour/>
                <GroupTour/>
            </>
        )}
        </>
    )
}

export default HomePage