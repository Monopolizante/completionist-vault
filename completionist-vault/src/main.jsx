import { createRoot } from 'react-dom/client';
import './index.css';
import router from '../src/router/routes';
import { RouterProvider } from 'react-router-dom';
import { CategoriesProvider } from './contexts/CategoriesContext';

createRoot(document.getElementById('root')).render(
    <CategoriesProvider>
        <RouterProvider router={router} />
    </CategoriesProvider>
)
