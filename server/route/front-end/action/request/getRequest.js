const express = require('express')
const promisify = require('util').promisify
var os = require('os');
var networkInterfaces = os.networkInterfaces();
const router = express.Router()

// userImage: 'https://t1.ea.ltmcdn.com/en/images/1/7/1/20_white_cat_breeds_full_list_3171_orig.jpg',
// username: '@daviddobrik',
// videoId: '1',
// videoDescription: 'here is my white cat!'


router.get('/:userid/:pageNum/:pageLength',async(req,res)=>{
    var userid = req.params.userid
    //const Query = await promisify(connection.query.bind(connection))
    console.log(req.params)
    var sqlRequest =''
    if(userid=='all'){           
        sqlRequest=`select user.PhotoPath as img, RequestContent as requestMessage,IfRespond as responseCount, RequestId,user.UserId as requestor_id,user.UserName as requestor
        from request 
        inner join user
        on user.UserId = request.UserId
        order by RequestDate desc 
        limit ${req.params.pageNum},${parseInt(req.params.pageLength)}`
        
        console.log(sqlRequest)

    }else if(userid=='search'){
        sqlRequest=`select user.PhotoPath as img, request.RequestContent as requestMessage,request.IfRespond as responseCount, request.RequestId,request.UserId as requestor_id,user.UserName as requestor
        from request
        inner join user
        on user.UserId = request.UserId
        where requestContent Like '%${req.params.pageNum}%' order by RequestDate desc`

    }else if(userid=='request-from-you'){
        sqlRequest = `select RequestImagePath as img, RequestContent as requestMessage,IfRespond as responseCount, RequestId
                        from request
                        where request.UserId = '${req.params.pageNum}'
                        and RequestContent Like '%${req.params.pageLength}%' order by RequestDate desc`
    }else{
        sqlRequest = `select RequestImagePath as img, RequestContent as requestMessage,IfRespond as responseCount, RequestId
                        from request
                        where request.UserId = '${userid}'
                        order by RequestDate desc
                        limit ${req.params.pageNum},${parseInt(req.params.pageLength)}
                        `

    }
    console.log(sqlRequest)
    let requests = await req.execute(sqlRequest)


    
    //attach response to the request
    for(var i = 0 ; i<requests.length; i++){
        let sqlResponse = `select user.UserName as username, user.PhotoPath as userImage, video.VideoId as videoId,
                        video.VideoShortDescrtption as videoDescription,video.VideoImagePath as video_image
                        from user
                        inner join response
                        on user.UserId = response.UserId
                        inner join video 
                        on response.VideoId = video.VideoId
                        inner join request_response_relationship
                        on request_response_relationship.ResponseId = response.ResponseId
                        where request_response_relationship.RequestId= '${requests[i].RequestId}'
                        and response.Status=1`
        let responses = await req.execute(sqlResponse)
        
        if(responses.length!=0){
            
            for(var j = 0;j<responses.length;j++){
            if(responses[j].userImage)
                    responses[j].userImage=responses[j].userImage.split('|').join('//')
            }
            // if(responses.userImage!=''){
            //     responses.userImage =responses.userImage.split('|').join('//')
            // }
        }
        //console.log('response is ',responses)
        requests[i]['responses'] =responses
        
        if(requests[i]['img']!=null)
            requests[i]['img'] = requests[i]['img'].split('|').join('//')
        requests[i]['responseCount'] = responses.length + ' users have responded!'

    }
    
    //console.log('getRequest.js requests is ',requests)
    console.log(requests.length)
    res.send(requests)

})


module.exports=router;