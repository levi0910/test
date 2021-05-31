const express = require('express')
const promisify = require('util').promisify
const {connection,execute} = require('../../../../mysql/actions/connection')
var os = require('os');

const router = express.Router()

async function getVideo(video_id,req){
    if(typeof(video_id)==='number'){
        video_id = video_id.toString()
    }
    // let sqlCreator = `select user.UserId as id,user.UserName as username,user.PhotoPath as imageUri
    // from user
    // left join video
    // on user.Userid = video.VideoCreatorId
    // where video.VideoId='${video_id}'`

    // let users = await req.execute(sqlCreator)

    let sqlVideo = `select video.VideoPath as videoLocation,video.VideoId as VideoId,video.VideoShortDescrtption as description,
    video.VideoImagePath as videoImg,video.ThumbNumber as likes,video.Private as private,video.VideoCreateDate as dat
    from video
    where video.VideoId ='${video_id}' `

    let videos = await req.execute(sqlVideo)


   

    // let sqlComments = `select count(*) as comments
    //     from comment
    //     where comment.VideoId='${video_id}'`

    // let comments = await req.execute(sqlComments)

    var video = videos[0]

    if(video){
        // video['creator'] = users[0]
        // video['comments']=comments[0]['comments']

        // if(video['videoLocation'])
        //     video['videoLocation'] = video['videoLocation'].split('|').join('//')

        // if(video['creator'])
        //     if(video['creator']['imageUri'])
        //         video['creator']['imageUri'] = video['creator']['imageUri'].split('|').join('//')

        if(video['videoImg'])
            video['videoImg'] = video['videoImg'].split('|').join('//')
    }

    return video;
}


router.get('/:userid',async(req,res)=>{

    //const Query = await promisify(connection.query.bind(connection))

    var userid = req.params.userid;
    console.log('user id is ',userid)

    let sqlKeywords = `select keyword.KeywordId ,keyword.KeywordContent as keywords 
                    from user_keyword_relationship
                    left join keyword
                    on keyword.KeywordId = user_keyword_relationship.KeywordId
                    where user_keyword_relationship.UserId='${userid}'`

    let Keywords = await req.execute(sqlKeywords)

    console.log('recommend.js: user keywords is ',Keywords)

    var keywords = []

    //retrieve all the user preferences as keywords
    for(var i=0; i<Keywords.length;i++){
        if(Keywords[i].keywords!=null&&Keywords[i].keywords!='')
            keywords.push(Keywords[i].keywords)
    }

    
    
    //users keywords:[word1,word2,word3......word_n]
    videosId={}
    for(var i=0;i<keywords.length;i++){
        var uri = 'http://34.68.41.157/api/v1.0/video-recommendation?searchQuery='+keywords[i]
        var video_result = await req.fetch('GET',uri)
        video_result=JSON.parse(video_result)
        if(video_result.videoRecommendationList!=null){
            var video_list = video_result.videoRecommendationList
            
            for(var j=0;j<video_list.length;j++){
                video_list[j]=video_list[j]+1100;
            }
        }
        else{
            var video_list=null
        }
        if(video_list==null){
            video_list=['1','2','3']
        }
        videosId[keywords[i]] = video_list
        console.log(keywords[i],typeof(video_list[0]))
    }

    /*videosId:{
        keyword1:[video1,video2.....],
        keyword2:[video1,video2....].....
    }
    */
    console.log('Videos id is ',videosId)


    let result = {}

    if(videosId!=undefined){
    for(var key of Object.keys(videosId)){
        for(var i = 0; i<videosId[key].length; i++){
            let video_result = await getVideo(videosId[key][i],req)
                    
            if(i==0){
                result[key] = []
                }
            if(video_result)
                result[key].push(video_result)
                
            // console.log(result)

            //result.push(video)
            }
        }
        //====================================================================
        result['History'] = []
        let sql = `select VideoId from viewhistory where VistorId='${userid}'`
    
        var history_result = await req.execute(sql)
        /*
            result:[{VideoId:xxxx},{VideoId:xxxx},{VideoId:xxxx}......]
        */
        for(var i=0;i<history_result.length;i++){
            let video = await getVideo(history_result[i].VideoId,req)
    
            result['History'].push(video)
    
        }
        //=========================================================================
        result['Trend'] = []

        let sqlVideo = `select video.VideoPath as videoLocation,video.VideoId as VideoId,video.VideoShortDescrtption as description,
        video.VideoImagePath as videoImg,video.ThumbNumber as likes,video.Private as private,video.VideoCreateDate as dat
        from video
        order by Views desc
        limit 0,10 `

        let videos = await req.execute(sqlVideo)

        
        for(var i=0;i<videos.length;i++){
            if(videos[i]){
        

                if(videos[i]['videoImg'])
                videos[i]['videoImg'] = videos[i]['videoImg'].split('|').join('//')
            }
            result['Trend'].push(videos[i])
         }


     
        
    console.log(Object.keys(result))

    }

  


    

    //console.log(result)
    res.send(result)


})

module.exports=router;