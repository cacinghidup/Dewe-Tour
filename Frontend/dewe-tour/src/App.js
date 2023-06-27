import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes, redirect } from 'react-router-dom';
import './App.css';

import { useContext, useEffect, useState } from 'react';
import { PrivateRouteAdmin, PrivateRouteLogin, PrivateRouteUser, RouteNotFound } from './components/PrivateRoute';
import { API, setAuthToken } from './components/config/api';
import DetailTourism from './components/detailTour/detailTour';
import AddTrip from './components/mainPage/admin/addTrip';
import HomeAdmin from './components/mainPage/admin/homeAdmin';
import IncomeTrip from './components/mainPage/admin/incomeTrip';
import BackgroundImage from './components/mainPage/background/background';
import Footer from './components/mainPage/footer/footer';
import HomePage from './components/mainPage/home';
import NavigasiBar from './components/mainPage/navbar/navbar';
import UserProfile from './components/mainPage/user/userProfile';
import Payment from './components/payment/payment';
import PaymentSuccess from './components/payment/paymentSuccess';
import { UserContext } from './context/userContext';
import UserPay from './components/mainPage/user/userPay';

function App() {
  window.scrollTo(0,0)

  const [isLoading, setIsLoading] = useState(true)
  
  const [payDone, setpayDone] = useState({Pay: false})
  const payUp = (data2) => setpayDone(data2)
  
  const [userLogin, setuserLogin] = useState(false);
  const user = (data1) => setuserLogin(data1)
  
  const [userAdmin, setuserAdmin] = useState(false);
  const userAdminLogin = (data1) => setuserAdmin(data1)
  
  // const whoLogin = localStorage.getItem('role')
  // console.log("APP.js", state.role )
  const [state, dispatch] = useContext(UserContext);


  useEffect(() => {
    // Redirect Auth but just when isLoading is false
    if (!isLoading) {
      if (state.isLogin === false) {
        return redirect('/');
      }
    }
  }, [isLoading]);
  
  useEffect(() => {
    
    if (state.role === 'admin') {
      userAdminLogin(true)
    } else if (state.role === 'user') {
      user(true)
    }

  },[state])

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      checkUser();
    } else {
      setIsLoading(false)
    }
    // eslint-disable-next-line
  }, []);

  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth');
      console.log("check user success : ", response)
      // Get user data
      let payload = response?.data.data;
      // Get token from local storage
      payload.token = localStorage.token;
      // Send data to useContext
      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
      // console.log("INI di APP.js", payload)
      setIsLoading(false)
    } catch (error) {
      console.log("check user failed : ", error);
      dispatch({
        type: 'AUTH_ERROR',
      });
      setIsLoading(false)
    }
  };

  return (
    <>
    {isLoading ? null :
    <div style={{position:'relative', minHeight:'100vh'}}>
      <BrowserRouter>
      <BackgroundImage/>
      <NavigasiBar userAdmin={userAdminLogin} user={user} statusUser={userLogin} statusAdmin={userAdmin}/>
      <main>
          <Routes>

              {/* Jika USER salah memasukkan manual URL */}
              {/* <Route path='*' element={<RouteNotFound/>}> */}

              {/* URL ASLI */}
              <Route exact path='/' element={<HomePage userAdmin={userAdmin}/>}/>
              <Route exact path='/detailTour/:id' element={<DetailTourism statusUser={(userLogin)} isLoading={isLoading}/>}/>
              {/* <Route element={<PrivateRouteLogin/>}> */}
                <Route element={<PrivateRouteUser/>}>
                  <Route exact path='/payment/:id' element={<Payment payUp={payUp}/>}/>
                  <Route exact path='/paymentSuccess/:id' element={<PaymentSuccess prove={(payDone.Pay)}/>}/>
                  <Route exact path='/userProfile' element={<UserProfile prove={(payDone.Pay)}/>}/>
                  <Route exact path='/userPayment' element={<UserPay/>}/>
                </Route>

                <Route element={<PrivateRouteAdmin/>}>
                  <Route exact path="/homeAdmin" element={<HomeAdmin/>} />
                  <Route exact path="/admin" element={<IncomeTrip/>} />
                  <Route exact path="/admin/trip" element={<AddTrip/>} /> 
                </Route>
              {/* </Route> */}

          </Routes>
      </main>
      </BrowserRouter>  
      <br/>
      <br/>
      <br/>
      <br/>
      <Footer/>
    </div>
    }
    </>
  );
}

export default App;