const express = require('express')
const {connection,execute} = require('../../../../mysql/actions/connection')


const router = express.Router()

async function getRequestorId(request_id,req){

    var sql = `select UserId from request where RequestId='${request_id}'`
    var requestor_result = await req.execute(sql)

    var result = requestor_result[0].UserId

    return result
}


router.get('/:params_1/:params_2/:params_3',async(req,res)=>{

    var sqlResponses=''

    if(req.params.params_1=='search'){
        let userid = req.params.params_2
        let search = req.params.params_3
        sqlResponses = `select request.RequestId as requestId,request.RequestContent as requestMessage,
        request.RequestImagePath as img,response.ResponseId as response_id,user.UserName as username,user.PhotoPath as user_image
        from response 
        inner join request_response_relationship
        on response.ResponseId = request_response_relationship.ResponseId
        inner join request
        on request.RequestId = request_response_relationship.RequestId
        inner join user
        on user.UserId = request.UserId
        where response.UserId='${userid}' and response.Status='0' and request.RequestContent Like '%${search}%'`
    }else{
        let userid = req.params.params_1;

        sqlResponses = `select request.RequestId as requestId,request.RequestContent as requestMessage,
        request.RequestImagePath as img,response.ResponseId as response_id,user.UserName as username,user.PhotoPath as user_image
        from response 
        inner join request_response_relationship
        on response.ResponseId = request_response_relationship.ResponseId
        inner join request
        on request.RequestId = request_response_relationship.RequestId
        inner join user
        on user.UserId = request.UserId
        where response.UserId='${userid}' and response.Status='0'`
    }

       

    let Responses = await req.execute(sqlResponses)


   /* Responses:[
       response1:{
        requestId,
        img,
        RequestMessage
        },
        response2:{
        requestId,
        img,
        RequestMessage
        },
        .......
    ]          
    */
   //add requestor_id
//    var requestor_sql =``
//    let requestor_id_result = await req.execute(requestor_sql)
//    var requestor_id = requestor_id_result[0]

    if(Responses != undefined){
        for(var i=0; i<Responses.length; i++){
            let sqlCount = `select count(*) as responseNumber
            from request_response_relationship
            inner join response
            on response.ResponseId = request_response_relationship.ResponseId
            where RequestId='${Responses[i].requestId}' and response.Status=1`

            let count = await req.execute(sqlCount)

            Responses[i]['responseContent'] = count[0].responseNumber+' users has responded!'

            var requestor_id = await getRequestorId(Responses[i].requestId,req)

            Responses[i]['requestor_id'] = requestor_id

        }


    }

    res.send(Responses)



    
   

})


module.exports=router;