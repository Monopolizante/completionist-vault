import { createBrowserRouter } from 'react-router-dom'
import Home from "../Pages/Home"
import Jogos from "../Pages/Jogos"
import Login from "../Pages/Login"
import GamesNew from '../Pages/GamesNew'
import About from '../Pages/About'
import Stats from '../Pages/Stats'
import LoginNew from '../Pages/LoginNew'
const router = createBrowserRouter([
    {path: "/", element: <Home />},
    {path: "/jogos", element: <Jogos />},
    //{path: "/login", element: <Login />}, //login aleatorio do robson, pode ser que quebre algo
    {path: "/Login", element: <LoginNew />}, //Login para a pagina login muito mais foda osss
    {path: "/Games", element: <GamesNew />},
    {path: "/About", element: <About />},
    {path: "/Stats", element: <Stats/>},
])

export default router