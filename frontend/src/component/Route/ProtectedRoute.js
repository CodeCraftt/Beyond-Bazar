import React from "react";
import { useSelector } from "react-redux";
import { Navigate,Route } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, element }) => {
  const {isAuthenticated, user } = useSelector((state) => state.user);
  // const {loading,isAuthenticated, user } = useSelector((state) => state.user);
  // const nevigate=useNavigate();
 
  // if(isAuthenticated===false){
  //   return <Navigate to="/login" replace />
  // }
  // else{
  //   if(user){
  //     return element;
  //   }
  // }
  
  

  if(isAuthenticated){
    if(user){
      
      if(isAdmin===true && user.role!=="admin"){
        return <Navigate to="/login" replace />
      }
      return element;
    }
  }
  else{
    return <Navigate to="/login" replace />
  }

  
};

export default ProtectedRoute;



// import React from "react";
// import { Route, Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ adminRequired, element }) => {
//   const { isAuthenticated, user } = useSelector((state) => state.user);

//   if (isAuthenticated) {
//     if (adminRequired && user && user.role !== "admin") {
//       return <Navigate to="/login" replace />;
//     }
//     return element;
//   }

//   return <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;
