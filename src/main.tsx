import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { CartProvider } from './context/CartContext'
import { FilterProvider } from './context/FilterContext'
import { UserProvider } from './context/UserContext'
import { PedidosProvider } from './context/PedidosContext'
import { AdminProvider } from './context/AdminContext'
import { NotificationProvider } from './context/NotificationContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <AdminProvider>
        <UserProvider>
          <PedidosProvider>
            <CartProvider>
              <FilterProvider>
                <RouterProvider router={router} />
              </FilterProvider>
            </CartProvider>
          </PedidosProvider>
        </UserProvider>
      </AdminProvider>
    </NotificationProvider>
  </StrictMode>,
)
