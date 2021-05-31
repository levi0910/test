const express = require('express')
const router = express.Router()


router.get('/:query',async (req,res)=>{
   var sql = `SELECT video.VideoId as video_id,video.VideoImagePath as video_image,user.UserName as username,video.ThumbNumber as likes,
               video.VideoCreateDate as dat,video.private as private,video.VideoCreatorId as creator_id
            FROM video
            inner join user 
            on user.UserId = video.VideoCreatorId
            WHERE video.VideoName LIKE '%${req.params.query}%'`

   var videos = await req.execute(sql)
 
   for(var i=0;i<videos.length;i++){
      let keyword = []
      let length=3
      let video_id = videos[i].video_id
      let sql = `select KeywordContent 
                  from keyword
                  inner join video_keyword_relationship
                  on keyword.KeywordId =video_keyword_relationship.KeywordId
                  where video_keyword_relationship.VideoId='${video_id}' `
      let keyword_result = await req.execute(sql)
      if(keyword_result.length<length)
            length=keyword_result.length
      for(var j=0;j<length;j++){
         keyword.push(keyword_result[j].KeywordContent)
      }
      videos[i]['keyword']=keyword;

   }
   
   res.send(videos)



})


module.exports=router