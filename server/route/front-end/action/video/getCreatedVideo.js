const express = require('express')
const router = express.Router()


router.get('/:userid',async (req,res)=>{
    var params = req.params;
    let sql = `select VideoId as video_id, VideoImagePath as video_image,ThumbNumber as likes,Private as private,VideoName as name
                from video
                where VideoCreatorId='${params.userid}' order by VideoCreateDate`
    
    let result = await req.execute(sql)
    for(var i=0;i<result.length;i++){
        result[i].video_image = result[i].video_image.split('|').join('//')
    }
    
    res.send(result)
    /*
   [{
        video_id,
        video_image
    }]

    */
})

module.exports=router