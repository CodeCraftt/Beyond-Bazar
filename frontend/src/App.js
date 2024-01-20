import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route,Navigate } from "react-router-dom";
import axios from "axios";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from '@stripe/stripe-js'

import Webfont from "webfontloader";
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userAction";
import { useSelector } from "react-redux";
import UserOptions from "./component/layout/Header/UserOptions";
import Profile from "./component/User/Profile";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile.js"
import UpdatePassword from "./component/User/UpdatePassword.js"
import ForgotPassword from "./component/User/ForgotPassword.js"
import ResetPassword from "./component/User/ResetPassword.js"
import Cart from './component/Cart/Cart.js'
import Shipping from './component/Cart/Shipping.js'
import ConfirmOrder from "./component/Cart/ConfirmOrder.js"
import Payment from "./component/Cart/Payment.js"
import OrderSucess from "./component/Cart/OrderSucess.js"
import MyOrders from "./component/Order/MyOrders.js"
import OrderDetails from "./component/Order/OrderDetails.js"
import Dashboard from "./component/admin/Dashboard.js"
import ProductList from "./component/admin/ProductList.js"
import NewProduct from "./component/admin/NewProduct.js";
import UpdateProduct from "./component/admin/UpdateProduct.js"
import OrderList from './component/admin/OrderList.js'
import ProcessOrder from "./component/admin/ProcessOrder.js"
import UsersList from "./component/admin/UsersList.js"
import UpdateUser from './component/admin/UpdateUser.js'
import ProductReviews from "./component/admin/ProductReviews.js"

import Contact from "./component/layout/contact/Contact.js"
import About from "./component/layout/about/About.js"
import NotFound from './component/notfound/NotFound.js'

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
const [stripeApiKey, setStripeApiKey] = useState("");
const [fetchStripeApiKey, setFetchStripeApiKey] = useState(true); // Add a flag

async function getStripeApiKey() {
  try {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  } catch (error) {
    console.log(error);
  }
}

React.useEffect(() => {
  Webfont.load({
    google: {
      families: ["Roboto", "Droid Sans", "Chilanka"],
    },
  });

  store.dispatch(loadUser());
}, []);

React.useEffect(() => {
  if (isAuthenticated && fetchStripeApiKey) {
    getStripeApiKey();
    setFetchStripeApiKey(false); // Set the flag to false to prevent further calls
  }
}, [isAuthenticated, fetchStripeApiKey]); // Include both isAuthenticated and fetchStripeApiKey in the dependency array

window.addEventListener("contextmenu", (e) => e.preventDefault());

  

  return (
    <Router>
      <Header></Header>
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />


        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/account" element={<ProtectedRoute element={<Profile />} />}/>
        <Route path="/me/update" element={<ProtectedRoute element={<UpdateProfile/>} />}/>
        <Route path="/password/update" element={<ProtectedRoute element={<UpdatePassword />}/>}/>
        <Route path="/password/forgot" element={<ForgotPassword />}/>
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="cart" element={<Cart />} />

        <Route path="/shipping" element={<ProtectedRoute element={<Shipping />}/>}/>
       
        
     
        {stripeApiKey && (
          <Route
            path="/process/payment"
            element={
              <Elements stripe={loadStripe(stripeApiKey)}>
                <ProtectedRoute element={<Payment />}/>
              </Elements>
            }
          />
        )}


        <Route path="/success" element={<ProtectedRoute element={<OrderSucess />}/>}/>

        <Route path="/orders" element={<ProtectedRoute element={<MyOrders />}/>}/>
        
       
       {/* <Switch> */}
       <Route path="/order/confirm" element={<ProtectedRoute element={<ConfirmOrder />}/>}/>
        <Route path="/order/:id" element={<ProtectedRoute element={<OrderDetails />}/>}/>
       {/* </Switch> */}
        <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true}  element={<Dashboard />}/>}/>
        <Route path="/admin/products" element={<ProtectedRoute isAdmin={true}  element={<ProductList />}/>}/>

        <Route path="/admin/product" element={<ProtectedRoute isAdmin={true}  element={<NewProduct />}/>}/>
        <Route path="/admin/product/:id" element={<ProtectedRoute isAdmin={true}  element={<UpdateProduct />}/>}/>
        <Route path="/admin/orders" element={<ProtectedRoute isAdmin={true}  element={<OrderList />}/>}/>
        <Route path="/admin/order/:id" element={<ProtectedRoute isAdmin={true}  element={<ProcessOrder />}/>}/>
        <Route path="/admin/users" element={<ProtectedRoute isAdmin={true}  element={<UsersList />}/>}/>
        <Route path="/admin/user/:id" element={<ProtectedRoute isAdmin={true}  element={<UpdateUser />}/>}/>
        <Route path="/admin/reviews" element={<ProtectedRoute isAdmin={true}  element={<ProductReviews />}/>}/>
    
        <Route path="*" element={<NotFound />} />
      </Routes>
       
       

      <Footer></Footer>
    </Router>
  );
}

export default App;
