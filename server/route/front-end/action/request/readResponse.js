const express = require('express')
const router = express.Router()

router.get('/:response_id',async(req,res)=>{

    var response_id = req.params.response_id;
    console.log(response_id)
    let sqlDelete = `update response
                     set Status='1'
                    where ResponseId='${response_id}'`

    let Responses = await req.execute(sqlDelete)
   
    res.send({status:true,message:'success'})


})


module.exports=router;