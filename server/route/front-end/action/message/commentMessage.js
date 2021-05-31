const express = require('express')
const router = express.Router()

router.get('/:userid',async(req,res)=>{
    console.log(req.params)
    var sql = `select user1.UserName as commentator, UNIX_TIMESTAMP(comment.CommentDate) as dat,comment.CommentId as comment_id
    from user as user1
    inner join comment
    on user1.UserId = comment.CommentatorId
    inner join video
    on comment.VideoId = video.VideoId
    inner join user as user2
    on user2.UserId = video.VideoCreatorId
    where user2.UserId = '${req.params.userid}' and comment.isRead='0'`

    var result = await req.execute(sql)

    res.send(result)
})

module.exports=router