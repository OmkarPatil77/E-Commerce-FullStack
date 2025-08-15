import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider } 
  from 'react-router-dom';
import Layout from './Layout/Layout';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import ViewProfile from './pages/ViewProfile';
import UpdateProfile from './pages/UpdateProfile';
import AddProduct from './pages/AddProduct';
import ViewProduct from './pages/ViewProduct';
import UpdateProduct from './pages/UpdateProduct';
import AddReview from './pages/AddReview';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Search from './pages/Search';
import PaymentSuccess from './pages/Success';
import PaymentFailure from './pages/Failure';
import AdminDashboard from './pages/AdminDashboard';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<Home />} />
      <Route path='register' element={<Register />} />
      <Route path='login' element={<Login />} />
      <Route path='home' element={<Home />} />
      <Route path="/view-profile" element={<ViewProfile />} />
      <Route path="/update-profile" element={<UpdateProfile />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/view-product/:id" element={<ViewProduct />} />
      <Route path="/action-product/:id" element={<UpdateProduct />} />
      <Route path="/add-review/:productId" element={<AddReview />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/search" element={<Search />} />
      <Route path="/success" element={<PaymentSuccess />} />
      <Route path="/failure" element={<PaymentFailure />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />

    </Route>
  )
);

export default function App() {
  return(
    <>
      <RouterProvider router={router} />
    </>
  )
}
