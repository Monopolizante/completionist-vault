import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import router from '../src/router/routes';
import { RouterProvider } from 'react-router-dom';
import { ReactDOM } from 'react';




createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}>
    </RouterProvider>
)
