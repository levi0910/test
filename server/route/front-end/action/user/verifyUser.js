const express = require('express')
const router = express.Router()


router.get('/:email/:code',async(req,res)=>{
    var params=req.params
     var sql = `select * from email where Email='${params.email}'`
     var result = await req.execute(sql)
     if(result.length==0){
         res.send({status:-1,message:'no code has been sent'})
     }else{
         let time = Date.now()
         let date = new Date(result[0].Date).getTime()
         if(time-date>300000)
         		res.send({status:0,message:'code has expired,please resend'})
         	else if(result[0].Code!=params.code){
         		res.send({status:1,message:'incorrect code'})
         	}else{
         		res.send({status:2,message:'correct'})
         		//let sql = `delete from email where Email='${params.email}'`
         		//req.execute(sql)
                //res.send({status:2,date:date/1000,time:time/1000,period:(time-date)/1000})
         	}

         
         
        
     }

})


module.exports=router