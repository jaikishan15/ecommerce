const express=require('express');
const router=express.Router();
const {Product} = require('../model/products');
const { Category } = require('../model/category')
const multer = require('multer');


const FILE_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'jpeg'
    ,'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
    //   
      const isValid=FILE_TYPE_MAP[file.mimetype]
      let uploadError = new Error('invalid type image')
      if(isValid){
        uploadError=null
      }
      cb(uploadError,'public/uploads')
    },
    filename:function(req,res,cb){
         const fileName=file.originalname.split(' ').join('-');
         const extension=FILE_TYPE_MAP[file.mimetype];
         cb(null,`${fileName}-${Date.now()}.${extension}`)

    }
    
  })
  const uploadOptions = multer({ storage: storage })






router.get(`/`,async(req,res)=>{
    const productsList= await Product.find()
    // .select('name image -_id');
    if(!productsList){
        res.status(500).json({success:false})
    }
    res.send(productsList);
})

router.get(`/:id`,async(req,res)=>{
    const product= await Product.findById(req.params.id);
    if(!product){
        res.status(500).json({success:false})
    }
    res.send(product);
})

router.post(`/`,uploadOptions.single('image'), async(req,res)=>{
    const category=await Category.findById(req.param.product);
    
    if(!category)return res.status(400).send('invalid product')
    const fileName=req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads`;
    const product=new Product({
        name:req.body.name,
        description:req.body,description,
        richDescription:req.body.richDescription,
        image:`${basePath}${fileName}`,//,"http://localhost:3000/public/uploads/image-232323",
        brand:req.body.brand,
        price:req.body.price,
        product:req.body.product,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured
    })
    product=await product.save();
    if(!product){
        return res.status(500).send('item cannot be created')
    }
    res.send(product);
})

router.put(`/:id`,async(req,res)=>{
    const products = await Category.findById(req.body.product)
    if(!products){
        res.status(500).send('the product is not updated')
    }
    const product=await Category.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        description:req.body,description,
        richDescription:req.body.richDescription,
        image:req.body.image,
        brand:req.body.brand,
        price:req.body.price,
        product:req.body.product,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured
    }
    ,{new:true}
    )
    if(!product){
        return res.status(404).send('the item cannot be updated');
    }
    res.send(product);
})

router.delete('/:id',async(req,res)=>{
    Product.findByIdAndRemove(req.params.id).then(product=>{
        if(product){
            return res.status(200).json({success:true,message:'the product is deleted'})
        }
        else{
            return res.status(400).json({success:true,message:'the product is  not deleted'})
        }
    }).catch(err=>{
        return res.status(400).json({success:true,error:err})
    })
})

router.get(`/get/featured`,async(req,res)=>{
    const products = await Product.find({isFeatured:false})
    if(!products){
        res.status(500).json({json:true})
    }
    res.send(products)
})

module.exports=router;