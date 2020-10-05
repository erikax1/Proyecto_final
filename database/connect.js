const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://luis:354575797@cluster0-7er3y.mongodb.net/test',{
   useNewUrlParser: true,
   useUnifiedTopology: true
 }).then(()=>{
  console.log('succes');
}).catch(err=>{
  console.log(err);
});

module.exports=mongoose;
