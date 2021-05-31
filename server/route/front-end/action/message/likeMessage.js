const express = require('express')
const router = express.Router()

router.get('/:userid',async(req,res)=>{
    var sql = `select user.UserName as username,UNIX_TIMESTAMP(wuduplz.like.LikeDate) as dat
    from wuduplz.like
    inner join user
    on user.UserId=wuduplz.like.UserId
    where  user.UserId = '${req.params.userid}'`

    var result = await req.execute(sql)

    res.send(result)
})

module.exports=router