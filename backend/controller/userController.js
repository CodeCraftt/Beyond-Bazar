const ErrorHandler=require('../utils/errorhandler');
const catchAsyncError=require('../middleware/catchAsyncError');
const User=require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail=require('../utils/sendEmail.js');
const crypto=require('crypto');
const cloudinary=require('cloudinary');


// Register a user
exports.registerUser= catchAsyncError(async(req,res,next)=>{

    const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale",
    })

    const {name,email,password}=req.body;
     
    const user=await User.create({
        name, 
        email,
        password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    });

    sendToken(user,201,res);
})


// Login User

exports.loginUser=catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;
    
    // checking if user has given password and mail both

    if(!email || !password){
        return next(new ErrorHandler("Please enter email & password", 400));
    }

    const user =await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    const isPasswordMatched=await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }
   
    sendToken(user,200,res);
})


// Logout user
exports.logout=catchAsyncError(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:"Logged Out"
    })
})

// Forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Generate the reset password token and save it to the user
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Construct the reset password URL
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    // Create the email message
    const message = `Your password reset link is: ${resetPasswordUrl}\n\nIf you haven't requested this, please ignore it.`;

    try {
        // console.log("ram");
        // Send the email with the reset password link
        await sendEmail({
            email: user.email,
            subject: `Beyond Bazar Password Recovery`,
            message,
        });
        
        res.status(200).json({
            success: true,
            message: `An email has been sent to ${user.email} with further instructions.`,
        });
    } catch (error) {
        // Handle errors and reset the user's token and expiration
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});



// Reset password 
exports.resetPassword=catchAsyncError(async(req,res,next)=>{
    // creating token hash
    const resetPasswordToken=crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
     
    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })

    if(!user){
        return next(new ErrorHandler("Reset password link is invalid ",400));

    }

    if(req.body.password!== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not password",400))
    }

    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    user.save();

    sendToken(user,200,res);
})



// Get user detail

exports.getUserDetails=catchAsyncError(async(req,res,next)=>{

    const user=await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })
})


//  Update user password

exports.updatePassword=catchAsyncError(async(req,res,next)=>{

    const user=await User.findById(req.user.id).select("+password");

    const isPasswordMatched=await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",400));
    }

    if(req.body.newPassword!=req.body.confirmPassword){
        return next(new ErrorHandler("password does not match",400));
    }

    user.password=req.body.newPassword
    
    await user.save();

    sendToken(user,200,res);
})


// Update user profile

// exports.updateProfile = catchAsyncError(async (req, res, next) => {
//     const newUserData = {
//       name: req.body.name,
//       email: req.body.email,
//     };
  
//     if (req.body.avatar !== "") {
//       const user = await User.findById(req.user.id);
  
//       const imageId = user.avatar.public_id;
  
//       await cloudinary.v2.uploader.destroy(imageId);
  
//       const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//         folder: "avatars",
//         width: 150,
//         crop: "scale",
//       });
  
//       newUserData.avatar = {
//         public_id: myCloud.public_id,
//         url: myCloud.secure_url,
//       };
//     }
  
//     const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
//       new: true,
//       runValidators: true,
//       useFindAndModify: false,
//     });
  
//     res.status(200).json({
//       success: true,
//     });
//   });
  
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
        };
        // console.log("jay mataji general");
        if (req.body.avatar) {
            // console.log("jay mataji avatar");
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

            const imageId = user.avatar ? user.avatar.public_id : null;

            if (imageId) {
                await cloudinary.v2.uploader.destroy(imageId);
            }

            const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: 'avatars',
                width: 150,
                crop: 'scale',
            });

            newUserData.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            newUserData,
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            data: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message, // Include the actual error message
        });
    }
});

// exports.updateProfile = catchAsyncError(async (req, res, next) => {
//     try {
//       const newUserData = {
//         name: req.body.name,
//         email: req.body.email,
//       };
  
//       if (req.body.avatar) {
//         const user = await User.findById(req.user.id);
//         if (!user) {
//           return res.status(404).json({
//             success: false,
//             message: 'User not found',
//           });
//         }
  
//         const imageId = user.avatar ? user.avatar.public_id : null;
  
//         if (imageId) {
//           await cloudinary.v2.uploader.destroy(imageId);
//         }
  
//         const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//           folder: 'avatars',
//           width: 150,
//           crop: 'scale',
//         });
  
//         newUserData.avatar = {
//           public_id: myCloud.public_id,
//           url: myCloud.secure_url,
//         };
//       }
  
//       const updatedUser = await User.findByIdAndUpdate(
//         req.user.id,
//         newUserData,
//         {
//           new: true,
//           runValidators: true,
//           useFindAndModify: false,
//         }
//       );
  
//       if (!updatedUser) {
//         return res.status(404).json({
//           success: false,
//           message: 'User not found',
//         });
//       }
  
//       res.status(200).json({
//         success: true,
//         data: updatedUser,
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Internal Server Error',
//       });
//     }
//   });
  
//  Get all users (admin)

exports.getAllUsers =catchAsyncError(async(req,res,next)=>{
    const users=await User.find();

    res.status(200).json({
        success:true,
        users,
    })

})

// Get single user by admin

exports.getSingleUser =catchAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exit with Id: ${req.params.id}`));
    }
 

    res.status(200).json({
        success:true,
        user,
    })

})

// update user role  --Admin

exports.updateUserRole=catchAsyncError(async(req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }

    await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });


    res.status(200).json({
        success:true
    })
})

// Delete User --Admin

exports.deleteUser=catchAsyncError(async(req,res,next)=>{

    const user=await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`));
    }

    const imageId = user.avatar ? user.avatar.public_id : null;

    if (imageId) {
        await cloudinary.v2.uploader.destroy(imageId);
    }

    await user.deleteOne();
 
    res.status(200).json({
        success:true,
        message:"Use deleted successfully"
    })
})