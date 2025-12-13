import { createBrowserRouter } from "react-router-dom"
import { RootLayout } from "../layouts/RootLayout";
import { 
    HomePage, 
    NosotrosPage, 
    PastelesPage, 
    CartPage, 
    ProductDetailPage,
    CuentaPage,
    LoginPage,
    RegistroPage,
    AdministradorPage
} from "../pages";



export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout/>,
    //Rutas hijas que vamos ir anidando
    children : [
        {
            //Toma el mismo path que el padre
            index: true,
            element: <HomePage/>,
        },
        {
            path: 'pasteles',
            element: <PastelesPage/>,
        },
        {
            path: 'pasteles/:id',
            element: <ProductDetailPage/>,
        },
        {
            path: 'nosotros',
            element: <NosotrosPage/>,
        },
        {
            path: 'cart',
            element: <CartPage/>,
        },
        {
            path: 'account',
            element: <CuentaPage/>,
        },
        {
            path: 'login',
            element: <LoginPage/>,
        },
        {
            path: 'registro',
            element: <RegistroPage/>,
        },
        {
            path: 'admin',
            element: <AdministradorPage/>,
        }
    ]
  },
]);