const express = require('express')
const router = express.Router()


router.post('/',async(req,res)=>{
    let sql = `delete from message where MessageId='${req.body.id}'`

    var result = await req.execute(sql)

   console.log(result)
        

    res.send(result)
    
})


module.exports=router