const express = require('express')
const connection = require('../../../../mysql/actions/connection')

const like = express.Router()

like.post('/',async (req,res)=>{
    var params = req.body
    console.log(params)
    var userid = params.UserId
    var videoid = params.VideoId
    var date = new Date();
    var sql = ""
    var result = ''
    var sql_video_like=''
    if(params.islike){
        sql =`DELETE FROM wuduplz.like WHERE UserId='${userid}' AND VideoId='${videoid}'`
        sql_video_like=`update video set video.ThumbNumber = video.ThumbNumber-1 where VideoId='${videoid}'`
        result='like down'
        //console.log(sql)
    }else{
        let id = await req.generate_id(req)
        sql = `INSERT INTO wuduplz.like VALUES ('${id}','${videoid}','${userid}',NOW())`;
        sql_video_like=`update video set ThumbNumber =ThumbNumber+1 where VideoId='${videoid}'`
        result = 'like up'
        if(userid!=params.creator_id){
            let sql_message = `insert into message values(uuid(),'like','${id}',NOW(),'${userid}','${videoid}','${params.creator_id}')`
            await req.execute(sql_message)
            var user_store = await req.admin.firestore().collection('users').doc(params.creator_id).get()
            if(user_store['_fieldsProto']){
                  req.admin.messaging().sendMulticast({
                                data: {Like:'Someone liked you '},
                                tokens: [user_store['_fieldsProto']['notificationTokens']['stringValue']],
                        }).then((response) => {
                                console.log(response.successCount + ' messages were sent successfully');
                        })

                  req.admin.messaging().sendMulticast({
                          notification: {
                                title: 'Like',
                                body: 'someone liked you'
                              },
                          tokens: [user_store['_fieldsProto']['notificationTokens']['stringValue']],
                }).then((response) => {
                          console.log(response.successCount + ' notifications were sent successfully');
                })

              }
                  }
       // console.log(sql)
    }
  await req.execute(sql_video_like)
  var result = await req.execute(sql)
  res.send(result)
    
})


module.exports = like