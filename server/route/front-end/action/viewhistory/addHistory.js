const express = require('express')


const router = express.Router()


router.post('/',async(req,res)=>{
    var params = req.body
    console.log('addHistory.js ',params)
    //params:{user_id,video_id}
    let sql =`insert into viewhistory (HistoryId,ViewDate,VistorId,VideoId) values (uuid(),NOW(),'${params.user_id}','${params.video_id}')`
    await req.execute(sql)
    res.send('added history')
})

module.exports=router;