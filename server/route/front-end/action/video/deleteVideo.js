const express = require('express')
const router = express.Router()

const deleteFile = async(filepath,req)=>{
    let path = req.Path.resolve(__dirname,'../../../../public','videos',filepath.split('|').pop())   
    if(req.fs.existsSync(path)){
        try {
            req.fs.unlinkSync(path)
            //file removed
        } catch(err) {
            console.error('err')
        }
   }
}
router.get('/:video_id',async (req,res)=>{
    var params = req.params;
    //delete video file and video image file
    let sql_path = `select VideoPath, VideoImagePath from video where VideoId='${params.video_id}'`
    /*
        [
            {VideoPath,VideoImagePath}
        ]

    */
   let path_result = await req.execute(sql_path)
   let path = path_result[0]

   await deleteFile(path.VideoPath,req)
   await deleteFile(path.VideoImagePath,req)

   //delete the response if it exists
   let response_delete_sql=`delete from response where VideoId='${params.video_id}'`


   await req.execute(response_delete_sql)

   //delete keywords of the video
   let keywords_id_sql = `select keyword.KeywordId 
                            from keyword
                            inner join video_keyword_relationship
                            on video_keyword_relationship.KeywordId = keyword.KeywordId
                            where video_keyword_relationship.VideoId='${params.video_id}'
                            `
    
    let keyword_id_result = await req.execute(keywords_id_sql)

    for(var i=0;i<keyword_id_result.length;i++){
        let sql = `delete from keyword where KeywordId='${keyword_id_result[i].KeywordId}'`
        await req.execute(sql)
    } 

    let relationship_delete_sql = `delete from video_keyword_relationship where VideoId='${params.video_id}'`

    //delete comment
    let comment_delete_sql = `delete from comment where VideoId = '${params.video_id}'`
    await req.execute(comment_delete_sql)


    //delete video information

    let video_delete_sql = `delete from video where VideoId='${params.video_id}'`
    await req.execute(video_delete_sql)




    res.send('OK')
    /*
   [{
        video_id,
        video_image
    }]

    */
})

module.exports=router