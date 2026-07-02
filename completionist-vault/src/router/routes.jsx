import { createBrowserRouter } from 'react-router-dom'
import Home from "../Pages/Home"
import GamesNew from '../Pages/GamesNew'
import About from '../Pages/About'
import Stats from '../Pages/Stats'
import Achievements from '../Components/Achievements'
import LoginVault from '../Pages/LoginVault'
import CadastroVault from '../Pages/CadastroVault'
const router = createBrowserRouter([
    {path: "/", element: <Home />},
    {path: "/Games", element: <GamesNew />},
    {path: "/About", element: <About />},
    {path: "/Stats", element: <Stats />},
    //{path: "/Achievements", element: <Achievements />}
    {path: "/games/:appId/achievements", element: <Achievements />},
    {path: "/loginVault", element: <LoginVault />},
    {path: "/cadastroVault", element: <CadastroVault/>}

])

export default router