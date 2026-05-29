import { createBrowserRouter } from 'react-router-dom'
import Home from "../Pages/Home"
import Jogos from "../Pages/Jogos"
import Login from "../Pages/Login"
const router = createBrowserRouter([
    {path: "/", element: <Home />},
    {path: "/jogos", element: <Jogos />},
    {path: "/login", element: <Login />}
])

export default router