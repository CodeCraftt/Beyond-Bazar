import React, { Fragment, useEffect } from 'react'
import {CgMouse} from "react-icons/cg";
import "./Home.css";
import MetaData from "../layout/MetaData";
import ProductCard from "./ProductCard.js"
import {getProduct,clearErrors} from "../../actions/productAction";
import {useSelector,useDispatch} from "react-redux";
import Loader from '../layout/Loader/Loader'
import { useAlert } from 'react-alert';
import logo from "../../images/bb.jpg"

const Home = () => {
  
  const alert=useAlert();
  const dispatch=useDispatch();
  const {loading,error,products}=useSelector(state=>state.products);
  useEffect(()=>{
    if(error){
      alert.error(error);
         dispatch(clearErrors());
    }
   dispatch(getProduct());
  },[dispatch,error,alert]);
 
 
  return (
    <Fragment>
      {loading?(
        <Loader></Loader>
      ):
      (<>
        <MetaData title="Beyond Bazar"/>
        <div className='banner'>

            <p>Welcome to</p>
            <img className='neww' src={logo} alt="Beyond Bazar"></img>
            <h1>Fresh arrivals awaiting your attention.😎😎</h1>
    
           
             <a href='#container'>
                <button>
                    Scroll<CgMouse />
                </button>
            </a>
      
           

            
    
        </div>
    
        <h2 className='homeHeading'>Featured Products</h2>
    
        <div className='container' id="container">
        {products && products.map(pp=>(
          <ProductCard product={pp}/>
        ))}
    
        </div>
        </>)}
    </Fragment>
  )
}

export default Home