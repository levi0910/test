const express = require('express')
const router = express.Router()


const addItem = async(type,id,req)=>{
    if(type=='comment'){
        let sql = `select * from comment where CommentId ='${id}'`
        let result = await req.execute(sql)
        return result[0]

    }

    if(type=='like'){
        let sql = `select * from wuduplz.like where LikeId ='${id}'`
        console.log(sql)
        let result = await req.execute(sql)
        return result[0]

    }

    return undefined;

}

const addVideo = async(video_id,req)=>{
    let sql = `select * from video where VideoId ='${video_id}'`
        let result = await req.execute(sql)
        return result[0]

}

router.get('/:userid',async(req,res)=>{
    let sql = `select user.PhotoPath as user_image, user.UserName as user_name, message.Dat as dat,message.ActionId as item_id,
                message.Type as message_type,MessageId as message_id,VideoId
                from message
                inner join user
                on message.ResponderId = user.UserId
                where message.UserId ='${req.params.userid}'`

    var messages = await req.execute(sql)
    for(var i=0;i<messages.length;i++){
        var result = await addItem(messages[i].message_type,messages[i].item_id,req)
        var video = await addVideo(messages[i].VideoId,req)
        messages[i]['item']= result
        messages[i]['video']= video
        console.log(messages[i])

    }
        

    res.send(messages)
    
})


module.exports=router