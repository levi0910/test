const express = require('express')
const router = express.Router()


router.get('/:userid',async (req,res)=>{
    var params = req.params;
    let sql = `select video.VideoId as video_id, video.VideoImagePath as video_image,ThumbNumber as likes,Private as private,VideoCreatorId as creator_id,VideoName as name
                from video
                inner join wuduplz.like
                on wuduplz.like.VideoId = video.VideoId
                where wuduplz.like.UserId='${params.userid}'`
    
    let result = await req.execute(sql)
    for(var i=0;i<result.length;i++){
        result[i].video_image = result[i].video_image.split('|').join('//')
    }
    console.log(result)

    res.send(result)
    /*
   [{
        video_id,
        video_image
    }]

    */
})

module.exports=router