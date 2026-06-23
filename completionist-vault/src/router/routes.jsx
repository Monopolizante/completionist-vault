import { createBrowserRouter } from 'react-router-dom'
import Home from "../Pages/Home"
import GamesNew from '../Pages/GamesNew'
import About from '../Pages/About'
import Stats from '../Pages/Stats'
import LoginNew from '../Pages/LoginNew'
import Achievements from '../Components/Achievements'
const router = createBrowserRouter([
    {path: "/", element: <Home />},
    {path: "/Login", element: <LoginNew />}, //Login para a pagina login muito mais foda osss
    {path: "/Games", element: <GamesNew />},
    {path: "/About", element: <About />},
    {path: "/Stats", element: <Stats />},
    //{path: "/Achievements", element: <Achievements />}
    {path: "/games/:appId/achievements", element: <Achievements />}

])

export default router