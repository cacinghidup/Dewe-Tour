import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import jwtDecode from "jwt-decode";

export function PrivateRouteAdmin() {
    const [state] = useContext(UserContext);

    if (state.role === 'user') {
        return <Navigate to='/'/>
    } else if (!state.isLogin) {
        return <Navigate to='/'/>
    }

    return <Outlet />
}

export function PrivateRouteUser() {
    const [state] = useContext(UserContext);

    if (state.user === 'admin') {
        return <Navigate to='/homeAdmin'/>
    } else if (!state.isLogin) {
        return <Navigate to='/'/>
    }

    return <Outlet />
}

// export function PrivateRouteLogin() {
// const [state] = useContext(UserContext);

//     if (!state.isLogin) {
//         return <Navigate to="/" />
//     }
//     return <Outlet />
// }

// export function RouteNotFound() {

//     <Navigate to="/" />

// }