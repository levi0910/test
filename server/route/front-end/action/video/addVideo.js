const express = require('express')
const promisify = require('util').promisify
//const {connection,execute} = require('../../../../mysql/actions/connection')
var os = require('os');
var networkInterfaces = os.networkInterfaces();
const home = express.Router()


home.get('/:videoId/:user_id',async (req,res)=>{
    //console.log('home')
    //const Query = await promisify(connection.query.bind(connection))
    var id = req.params.videoId;




    let sqlUser = `SELECT user.UserId as id, user.UserName username,user.PhotoPath as imageUri
                    from user
                    left join video
                    on user.UserId = video.VideoCreatorId
                    where video.VideoId='${id}'`

    var user = await req.execute(sqlUser)

    console.log('home.js user is ',user)

    let sqlrequestor = `select video.RequestorId from video where video.VideoId = '${id}'`
    var requestor = await req.execute(sqlrequestor)
    var sqlVideo = ``
    if(requestor[0].RequestorId)
    		sqlVideo = `select video.VideoId as VideoId,video.VideoPath as videoLocation, video.VideoShortDescrtption as description,
                    video.Views as shares,video.Private as private,VideoImagePath as video_image,user.UserName as requestor
                    from video
                    inner join user
                    on video.RequestorId = user.UserId
                    where video.VideoId = '${id}'`
     else
	     sqlVideo = `select video.VideoId as VideoId,video.VideoPath as videoLocation, video.VideoShortDescrtption as description,
	                    video.Views as shares,video.Private as private,VideoImagePath as video_image
	                    from video
	                    
	                    where video.VideoId = '${id}'`
     	
   

    var video = await req.execute(sqlVideo)

    let sqlLikes = `select count(*) as likes
                    from wuduplz.like
                    where like.VideoId='${id}'`

    var likes = await req.execute(sqlLikes)

    let sqlComments = `select count(*) as comments
                        from comment
                        where comment.VideoId='${id}'`

    var comments = await req.execute(sqlComments)

    let islike_sql = `select * from wuduplz.like where VideoId='${req.params.videoId}' and UserId='${req.params.user_id}'`

    console.log('islike_sql is ',islike_sql)
    var islike = await req.execute(islike_sql)
    console.log(islike)

    


    var result = video[0]

    console.log(result)

    result['islike']=false
      console.log('temporaray result1 is ',result)

    if(islike[0])
        result['islike'] = true

    console.log('temporaray result is ',result)
   


    result['creator'] = user[0]
    result['likes']= likes[0]['likes']
    result['comments']=comments[0]['comments']


    console.log(result)
    result['videoLocation'] = result['videoLocation'].split('|').join('//')
    if(result['creator'])
        if(result['creator']['imageUri'])
            result['creator']['imageUri'] =result['creator']['imageUri'].split('|').join('//')
    console.log(result)
    //console.log(result)
    res.send(result)   

    // connection.query(sql,(err,result)=>{
    //         var re =  {
    //                 VideoId:null,
    //                 videoUri:null,
    //                 user:{
    //                     id:null,
    //                     username:null,
    //                     imageUri:null
    //                     },
    //                 Description:null,
    //                 RequestedBy:null,
    //                 likes:null,
    //                 comments:null,
    //                 shares:null,
    //                 RequestId:null
    //             }

    //         for(key in result[0]){
    //             if(key.includes('User')){
    //                 re['user'][key.slice(4,)] = result[0][key]
    //             }else{
    //                 re[key] = result[0][key]
    //             }
    //         }

    //         re['private'] = true
    //         re['user']['imageUri']=re['user']['imageUri'].split('||').join('/')
    //         //console.log(re)

    //         res.send(re)
    //     })

        
})
    






            

module.exports=home;