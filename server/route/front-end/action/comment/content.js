
const express = require('express')

const router = express.Router()


router.post('/',async(req,res)=>{
    var params = req.body
    console.log('params are ',params)
    var sql =''
    if(params.comment_id){
        sql = `select user.UserName as username, user.PhotoPath as photopath,comment.CommentContent as content,
                comment.CommentDate as commentdate,comment.ThumberNumber as thumbers,
                comment.CommentatorId as commentator_id,comment.CommentId as comment_id
                from comment 
                inner join user
                on comment.CommentatorId = user.UserId
                where VideoId = '${params.video_id}' and comment.CommentId not in ('${params.comment_id}')
                order by comment.CommentDate`
    }else{
        sql = `select user.UserName as username, user.PhotoPath as photopath,comment.CommentContent as content,
                comment.CommentDate as commentdate,comment.ThumberNumber as thumbers,
                comment.CommentatorId as commentator_id,comment.CommentId as comment_id
                from comment 
                inner join user
                on comment.CommentatorId = user.UserId
                where VideoId = '${params.video_id}'
                order by comment.CommentDate`
    }
    console.log(sql)
    var result = await req.execute(sql)
    if(params.comment_id){
        let sql_extra =  `select user.UserName as username, user.PhotoPath as photopath,comment.CommentContent as content,
        comment.CommentDate as commentdate,comment.ThumberNumber as thumbers,
        comment.CommentatorId as commentator_id,comment.CommentId as comment_id
        from comment 
        inner join user
        on comment.CommentatorId = user.UserId
        where VideoId = '${params.video_id}' and comment.CommentId ='${params.comment_id}'
        order by comment.CommentDate`

        let extra_result = await req.execute(sql_extra)
        result = extra_result.concat(result)
    }
    result.forEach((value,index)=>{
               if(value['photopath']!=null)
                     value['photopath']=value['photopath'].split('|').join('//')
              
            })
    
    res.send(result)
    
})


module.exports=router