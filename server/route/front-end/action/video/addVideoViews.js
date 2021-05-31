const express = require('express')
const router = express.Router()


router.get('/:video_id',async (req,res)=>{
    var params = req.params;
    let sql = `update video 
                set Views = Views+1
                where VideoId='${params.video_id}'`
    
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