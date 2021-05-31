const express = require('express')
const {connection,execute} = require('../../../../mysql/actions/connection')


const router = express.Router()


router.get('/:request_id',async(req,res)=>{

    var request_id = req.params.request_id;

    let sqlDelete = `delete from request where request.RequestId='${request_id}'`

    var result= await req.execute(sqlDelete)


    sqlDelete = `delete from request_response_relationship where request_response_relationship.RequestId='${request_id}'`

    await req.execute(sqlDelete)
   
    res.send({'status':result.affectedRows})


})


module.exports=router;