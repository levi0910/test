const express = require('express')
const router = express.Router()

router.get('/:comment_id',async(req,res)=>{
    console.log(req.params.comment_id)
    var sql = `update comment set comment.isRead='1'
    where CommentId = '${req.params.comment_id}'`

    var result = await req.execute(sql)

    res.send(result)
})

module.exports=router