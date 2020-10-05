const Producto=require('../../database/collection/producto');
const {format} = require('util');
const express=require('express');
const router=express.Router();
const empty=require('is-empty');
const {Storage} = require('@google-cloud/storage');
const multerGoogleStorage= require("multer-google-storage");
const Multer=require('multer');
const fs=require('fs');
const path=require('path');


router.get('/',async(req,res)=>{
    res.json(await Producto.find());
});

const gc=new Storage({
    keyFilename:path.join(__dirname,'../../google_app.json'),
    projectId:'rosy-environs-268816'
});

const multer=Multer({
    storage:Multer.memoryStorage()
});

const bucket=gc.bucket(process.env.GCLOUD_STORAGE_BUCKET||'bucket_prueba_sis719_2');


router.post('/producto',multer.array('img', 12),async(req,res)=>{
    console.log(req.body);
    console.log(req.files);
    let imgSet=[];
    if(!empty(req.files)){
      req.files.forEach(dat=>{
        const blob=bucket.file(dat.originalname);
        const blobStream=blob.createWriteStream({
          resumable:false
        });

        blobStream.on('error',(err)=>{
          res.json({message:err});
        });

        blobStream.on('finish',async()=>{
          console.log('finalizado');
        });
        blobStream.end(dat.buffer);
        let url='https://storage.googleapis.com/'+bucket.name+'/'+blob.name;
        imgSet.push({
          url
        });
      });
    }else{
      res.json({message:'no hay imagenes'});
    }
    req.body.urls=imgSet;
    let ins=new Producto(req.body);
    let result=await ins.save();
    if(empty(result)){
      res.json({message:'existio un error'});
    }else{
      res.json({message:'succes'});
    }
});

router.get('/vistaHome',(req,res)=>{
    Producto.find().select('_id title price urls creator').exec((err,docs)=>{
    //Producto.find().exec((err,docs)=>{
      let arr=[];
      if(!empty(docs)){
        docs.forEach(dat=>{
          arr.push({
            _id:dat._id,
            title:dat.title,
            price:dat.price+'',
            url:dat.urls[0].url,
            creator:dat.creator
          });
        });
        //console.log(arr);
        res.json(arr);
      }else{
        res.json([]);
      }
    });
});

router.get('/detalle/:id',(req,res)=>{
    let id=req.params.id;
    Producto.findOne({_id:id}).select('title price urls description').exec((err,doc)=>{
      if(!empty(doc)){
        res.json({
          message:'succes',
          title:doc.title,
          price:doc.price+'',
          description:doc.description,
          urls:doc.urls
        });
      }else{
        res.json({message:'no existe el id'});
      }
    });
});


router.post('/chatfilter',(req,res)=>{
    let idpr=req.body.idPr;
    let idchat=req.body.idChat;
    Producto.findOne({_id:idpr}).select('chat').exec((err,doc)=>{
      if(!empty(doc)){
        let index=doc.chat.findIndex(dat=>{return dat._id==idchat});
        res.json(doc.chat[index].messages);
      }
    });
});

router.post('/userfilter',(req,res)=>{
    let idpr=req.body.idPr;
    let idus=req.body.idUs;
    Producto.findOne({_id:idpr}).select('chat').exec((err,doc)=>{
      if(!empty(doc)){
        let index=doc.chat.findIndex(dat=>{return dat.idUser==idus});
        if(index==-1){
          res.json([]);
        }else{
          res.json(doc.chat[index].messages);
        }
      }
    });
});


module.exports=router;


//creacion del bucket
/*router.get('/',(req,res)=>{
    Producto.find({},async(err,docs)=>{
      if(empty(docs)){
        res.json({message:'no hay productos'});
      }else{
        /*const [bucket] = await gc.createBucket('prueba');

        console.log(bucket);
        res.json({message:`Bucket ${bucket.name} created.`});
        gc.createBucket('bucket_prueba_sis719').then(()=>{
          res.json({message:'success'})
        }).catch(err=>{
          res.json({err})
        });
      }
    });
});*/

/*const uploadHandler = Multer({
  storage:multerGoogleStorage.storageEngine({
      keyFilename:path.join(__dirname,'../../google_app.json'),
      projectId:'rosy-environs-268816',
      bucket:'bucket_prueba_sis719'
  })
});*/

/*router.post('/upload_other', multer.array('img', 12), (req, res, next) => {
  if (!req.files) {
    res.status(400).send('No file uploaded.');
    return;
  }
  console.log(req.file);
  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('error', (err) => {
    next(err);
  });

  blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );
    res.status(200).send(publicUrl);
  });

  blobStream.end(req.file.buffer);
});*/




/*router.get('/get_cloud_img',(req,res)=>{
    const blob = bucket.file(obj.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      next(err);
    });

    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
      res.status(200).send(publicUrl);
    });

    blobStream.end(obj.buffer);
});*/


/*const storage = multer.diskStorage({
    destination: function (res, file, cb) {
        try {
            fs.statSync('./public/uploads');
        } catch (e) {
            fs.mkdirSync('./public/uploads/');
        }
        cb(null, './public/uploads/');
    },
    filename: (res, file, cb) => {
        cb(null, 'IMG-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage });*/
