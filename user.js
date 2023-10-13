const {User} = require('../model/user');
const express = require('express');
const router = express.Router();
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get(`/`,async(req,res)=>{
    const userList= await User.find().select('-passwordHash');
    if(!userList){
        res.status(500).json({succes:false});
    }
    res.send(userList);
})

router.post('/',async(req,res)=>{
    let user=new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country
    })
    user=await user.save();
    if(!user){
        res.status(400).send('the category cannot be created');
    }
    res.send(user);
})

router.get(`/:id`,async(req,res)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        res.status(500).json({message:'item is not find'});
    }
    res.status(200).send(user);
})

router.post(`/login`,async(req,res)=>{
    const user= await User.findOne({email:req.body.email});
    const secret = process.env.SECRET;
    
    if(!user){
        res.status(400).send('user does not exist');
    }
    if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){
        
        const token = jwt.sign(
            {
            userId:user.id,
            isAdmin:user.isAdmin
        },
        secret,
        {expiresIn:'1d'}
        )
        res.status(200).send({user:user.email,token:token});
    }else{
        res.status(400).send('password is wrong')
    }
    
})

router.post(`/register`,async(req,res)=>{
    let user=new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country
    })
    user=await user.save();
    if(!user){
        res.status(400).send('the category cannot be created');
    }
    res.send(user);
})

router.delete('/:id',async(req,res)=>{
    User.findByIdAndRemove(req.params.id).then(user=>{
        if(user){
            return res.status(200).json({success:true,message:'the user is deleted'})
        }
        else{
            return res.status(400).json({success:true,message:'the user is  not deleted'})
        }
    }).catch(err=>{
        return res.status(400).json({success:true,error:err})
    })
})

module.exports=router;