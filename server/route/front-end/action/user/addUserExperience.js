const express = require('express')
const router = express.Router()



router.get('/:userid',async (req,res)=>{
    let sql = `update user set UserExperience = UserExperience+1 where UserId='${req.params.userid}'`
    await req.execute(sql)
    res.send({'status':true})


})



module.exports=router