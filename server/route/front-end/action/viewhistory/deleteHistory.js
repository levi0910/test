const express = require('express')


const router = express.Router()


router.post('/',async(req,res)=>{
    var params = req.body
    //params:{user_id,video_id}
    let sql =`delete from viewhistory where VistorId='${params.user_id}' and VideoId='${params.video_id}'`
    await req.execute(sql)
    res.send('deleted history')
})

module.exports=router;