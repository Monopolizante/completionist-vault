import { createBrowserRouter } from 'react-router-dom'
import Home from "../Pages/Home"
import Jogos from "../Pages/Jogos"
import Login from "../Pages/Login"
import GamesNew from '../Pages/GamesNew'
import About from '../Pages/About'
const router = createBrowserRouter([
    {path: "/", element: <Home />},
    {path: "/jogos", element: <Jogos />},
    {path: "/login", element: <Login />},
    {path: "/Games", element: <GamesNew />},
    {path: "/About", element: <About />}
])

export default router