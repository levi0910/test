
const {connection,execute} = require('../../../../mysql/actions/connection')

module.exports = async ( req , res) => {
        var params = req.body
        console.log(params)
        var comment_id =await req.generate_id(req)
        var sql = `INSERT INTO comment (CommentId,CommentContent,CommentatorId,CommentDate,ThumberNumber,VideoId,isRead) 
        VALUES ('${comment_id}','${params.CommentContent}','${params.CommentatorId}',
        NOW(),${params.ThumberNumber},'${params.videoId}','0')`
        var result = await req.execute(sql)

        if(params.CommentatorId!=params.UserId){
              sql = `select video.VideoCreatorId as userid from video where video.VideoId='${params.videoId}'`

              var userid_result = await req.execute(sql)


              sql = `insert into message values(uuid(),'comment','${comment_id}',NOW(),'${params.CommentatorId}','${params.videoId}','${params.UserId}')`

              await req.execute(sql)
        
        
              var userid = userid_result[0].userid

              console.log('user id is ',userid)

              var user_store = await req.admin.firestore().collection('users').doc(userid).get()
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

        res.send(result)
        // connection.query(sql,(err,result)=>{
                
        //         res.send(result)
        // })
        
}