const mongoose=require('mongoose');

mongoose.connect('mongodb://172.20.0.2:27017/proyectores',{
   useNewUrlParser: true,
   useUnifiedTopology: true
 }).then(()=>{
  console.log('succes');
}).catch(err=>{
  console.log(err);
});

module.exports=mongoose;
