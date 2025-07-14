import bcrypt from 'bcryptjs';
import User from '../models/users.model.js';
import jwt from 'jsonwebtoken'


export const signup= async (req,res)=>{
    const {userMail,userName,password,passwordConfirm}=req.body;
    try {
        if (!userMail || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide email and password'
        });
        }

        const existingUser = await User.findOne({userMail});
        if(existingUser){
            return res.status(400).json({success:false, message:"User already exists"})
        }
        if(password !== passwordConfirm){
            return  res.status(400).json({
            status: 'fail',
            message: 'Passwords do not match'
        });
        }

        const hashed= await bcrypt.hash(password,12);
        const user = new User({userName,userMail,password:hashed})
        await user.save();
        res.status(201).json({success:true, message:"User created succesfully"})
        
    } catch (error) {
        console.error(`Error:${error.message}`)
        res.status(500).json({message:"internal server error"})
    }
}

export const login=async (req,res)=>{
    const {userMail,password}=req.body;
    try{
        const user=await User.findOne({userMail}).select('+password');
        if (!user){
            return res.status(400).json({ success: 'fail', message: 'Invalid email or password' });
        }

        const matchPassword= await bcrypt.compare(password, user.password);
        if(!matchPassword){
            return res(400).json({success:true, message:'Invalid password'})
        }

        const token= jwt.sign(
            {id:user.id},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRES_IN||'30d'}
        );


        res.cookie('token',token,{
            httpOnly:true,
            sameSite:'strict',
            secure:false,
            maxAge:24*60*1000*1000
        });

        res.status(200).json({
        status: 'success',
        message: 'Login successful',
        user: {
            id: user._id,
            name: user.userName,
            email: user.userMail
        }
        });

    }catch (error){
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Server error' });
    }

}

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);
    res.clearCookie('token');
    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ status: 'success', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict',
    secure: false,
  });
  res.status(200).json({ message: 'Logged out successfully' });
};