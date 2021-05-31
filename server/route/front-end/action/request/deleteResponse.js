const { response } = require('express');
const express = require('express')
const router = express.Router()

router.get('/:response_id',async(req,res)=>{

    var response_id = req.params.response_id;
    console.log(response_id)
    let sqlDelete = `delete 
    from response
    where ResponseId='${response_id}'`

    let Responses = await req.execute(sqlDelete)
    console.log('deleted!')
   
    res.send('successfully deleted!')


})


module.exports=router;