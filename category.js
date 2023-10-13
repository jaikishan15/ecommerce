const {Category} =require('../model/category');
const express=require('express');
const router = express.Router();


router.get(`/`,async(req,res)=>{
    const categoryList=await Category.find();
    if(!categoryList){
        res.status(500).json({success:false})
    }
    res.send(categoryList);
})

router.get(`/:id`,async(req,res)=>{
    const category = await Category.findById(req.params.id);
    if(!category){
        res.status(500).json({message:'item is not find'});
    }
    res.status(200).send(category);
})



router.post('/',async(req,res)=>{
    let category=new Category({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    })
    category=await category.save();
    if(!category)
    return res.status(404).send('the category cannot be created')
    res.send(category);
})



router.delete('/:id',async(req,res)=>{
    Category.findByIdAndRemove(req.params.id).then(category=>{
        if(category){
            return res.status(200).json({success:true,message:'the category is deleted'})
        }
        else{
            return res.status(400).json({success:true,message:'the category is  not deleted'})
        }
    }).catch(err=>{
        return res.status(400).json({success:true,error:err})
    })
})

router.put(`/:id`,async(req,res)=>{
    const category=await Category.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    }
    ,{new:true}
    )
    if(!category){
        return res.status(404).send('the item cannot be updated');
    }
    res.send(category);
})

module.exports=router;