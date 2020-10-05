const User=require('../../database/collection/user');
const express=require('express');
const empty=require('is-empty');
const sha1=require('sha1');
const jwt=require('jsonwebtoken');
const auth=require('./auth');
const router=express.Router();

router.get('/',(req,res)=>{
    User.find({},(err,docs)=>{
      if(!empty(docs)){
        res.json(docs);
      }else{
        res.json({message:'no existen datos en la bd'});
      }
    });
});

router.post('/',async(req,res)=>{
    console.log(req.body);
    req.body.password=sha1(req.body.password);
    req.body.admin=false;
    req.body.notify=[];
    let ins=new User(req.body);
    let result=await ins.save();
    if(!empty(result)){
      res.json({message:'usuario insertado en la bd'});
    }else{
      res.json({message:'error'});
    }
});

router.post('/login',(req,res)=>{
    User.findOne({email:req.body.email},(err,doc)=>{
      if(!empty(doc)){
        if(sha1(req.body.password)==doc.password){
          let token=jwt.sign({
            id:doc._id,
            email:doc.email
          },process.env.JWT_KEY||'miClave',{
            expiresIn:"1h"
          });
          res.json({
            message:'Bienvenido',
            idUser:doc._id,
            name:doc.name,
            admin:doc.admin,
            token:token
          });
        }else{
          res.json({message:'password incorrecto'});
        }
      }else{
        res.json({message:'el email es incorrecto'});
      }
    });
});


router.get('/lista',(req,res)=>{
    User.find().select('name').exec((err,docs)=>{
      if(empty(docs)){
        res.json({message:'no existen usuarios'});
      }else{
        console.log(docs);
        res.json(docs);
      }
    });
});

router.patch('/update/:id',(req,res)=>{
    let id=req.params.id;
    User.findOne({_id:id}).select('admin').exec((err,doc)=>{
      if(!empty(doc)){
        doc.admin=true;
        User.findByIdAndUpdate(id,doc,()=>{
          console.log('actualizado');
        });
        res.json({message:'Este usuario ya es administrador'});
      }else{
        res.json({message:'error no existe el usuario'});
      }
    });
});


router.get('/noty/:id',(req,res)=>{
    let id=req.params.id;
    User.findOne({_id:id}).select('notify').exec((err,docs)=>{
      if(empty(docs)){
        res.json([]);
      }else{
        console.log(docs);
        res.json(docs.notify);
      }
    });
});





module.exports=router;
