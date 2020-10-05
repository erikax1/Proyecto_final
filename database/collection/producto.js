const mongoose=require('../connect');

const producto={
    title:String,
    price:Number,
    description:String,
    creator:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user'
    },
    chat:[{
      idUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
      },
      messages:[{
        name:String,
        message:String
      }]
    }],
    urls:[{
      url:String
    }]
}

productomodel=mongoose.model('producto',producto);

module.exports=productomodel;
