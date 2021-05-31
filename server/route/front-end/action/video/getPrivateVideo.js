const express = require('express')
const router = express.Router()


router.get('/:userid',async (req,res)=>{
    var params = req.params;
    let sql = `select VideoId as video_id, VideoImagePath as video_image
                from video
                where VideoCreatorId='${params.userid}'`
    
    let result = await req.execute(sql)

    res.send(result)
    /*
   [{
        video_id,
        video_image
    }]

    */
})

module.exports=router