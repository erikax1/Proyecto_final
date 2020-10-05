const mongoose=require('../connect');

const user={
    name:String,
    email:String,
    password:String,
    admin:Boolean,
    notify:[{
      titulo:String,
      idProd:String,
      idChat:String,
      idUs:String,
      fecha:Date
    }]
}

const usermodel=mongoose.model('usersocket',user);

module.exports=usermodel;
