import { createBrowserRouter } from 'react-router-dom'
import Home from '../../../../teste-completionist-vault-routing/src/pages/Home'

const router = createBrowserRouter([
    {path: "/", element: <Home />}
])

export default router