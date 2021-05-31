const { response } = require('express');
const express = require('express')
var os = require('os');
const reqHandle = require('../../../../middleware/reqHandle');
var networkInterfaces = os.networkInterfaces();
const router = express.Router()
/*
       insert the request created by requestor into database
       then send request to usermatching system, get a list of user_ids
       for each user in userlist, create a response for them, correlate the response to the received request
*/


const addUserInform = async(request_id,userid,req)=>{
       let sql_id = 'select uuid()'

       //add a response and record the responder's id
       var response_id = await req.execute(sql_id)
       response_id = response_id[0]['uuid()']
       let sql_response = `insert into response (ResponseId,UserId,Status,ResponseDate) values('${response_id}','${userid}','0',NOW())`
       await req.execute(sql_response)


       //add the response_request relationship
       let sql_response_requeset = `insert into request_response_relationship(RequestId,ResponseId) values('${request_id}','${response_id}')`
       await req.execute(sql_response_requeset)
}




router.post('/',async(req,res)=>{
       var params = req.body
       let sql_id = `select uuid()`
       var resultId = await req.execute(sql_id)
       var request_id = resultId[0]['uuid()']

       req.requests[request_id]=0;
       if(req.user_request[params.requestorId])
              delete req.requests[req.user_request[params.requestorId]]
       req.user_request[params.requestorId]=request_id

       // insert a request into database
       let sql = `insert into request (RequestId,UserId,RequestContent,IfRespond,RequestImagePath,RequestDate) values('${request_id}','${params.requestorId}',"${params.requestContent}",0,'${params.image_url}',NOW())`

       console.log(sql)
       
       var result = await req.execute(sql)
       console.log('search restul is ',result)

       //increase the user's RequestCount

       let sql_1 = `update user set RequestCount = RequestCount+1 where UserId = '${params.requestorId}'`
       var result = await req.execute(sql_1)
       console.log('sql_1 is ',sql_1)
//====================================================================

       //var request_keywords = await req.fetch('POST','http://34.68.41.157/request-keywords',{'content':params.requestContent})

       var user_list_result = await req.fetch('GET','http://34.68.41.157/api/v1.0/user-recommendation?searchQuery='+params.requestContent)
      
       var userlist=JSON.parse(user_list_result).userRecommendationList
        //userlist:[
       //      userid_1,
       //      userid_2,
       //      userid_3,
       //      ......  
       //]
       if(userlist==null){
              userlist=[]
              let sql = `select UserId from user order by UserExperience desc limit 0,5`
              let user_result = await req.execute(sql)
              for(var i=0;i<user_result.length;i++){
                     if(user_result[i].UserId!=params.requestorId)
                            userlist.push(user_result[i].UserId)
              }
              //userlist=['1','2','cbdef4d4-7168-11eb-a09f-f0795907d9ec']
        }else{
              for(var i=0;i<userlist.length;i++){
                     if(typeof(userlist[i])=='number')
                            userlist[i] = userlist[i].toString()
              }
              let sql = `select UserId from user order by UserExperience desc limit 0,5`
              let user_result = await req.execute(sql)
               for(var i=0;i<user_result.length;i++){
               	if(user_result[i].UserId!=params.requestorId)
               		userlist.push(user_result[i].UserId)
               }
              
                     
       }
       console.log('sendRequest.js userlist is ',userlist)

       for(var i=0;i<userlist.length;i++){
              addUserInform(request_id,userlist[i],req)
              var user_store = await req.admin.firestore().collection('users').doc(userlist[i]).get()
              if(user_store['_fieldsProto']&&userlist[i]!=params.requestorId){
                      req.admin.messaging().sendMulticast({
                                    data: {request:'A request is sent to you '},
                                    tokens: [user_store['_fieldsProto']['notificationTokens']['stringValue']],
                           }).then((response) => {
                                    console.log(response.successCount + ' messages were sent successfully');
                           })

                     req.admin.messaging().sendMulticast({
                            notification: {
                                   title: 'Request',
                                   body: 'A request is sent to you'
                                 },
                            data:{type:'RequestForYou'},
                            tokens: [user_store['_fieldsProto']['notificationTokens']['stringValue']],
                   }).then((response) => {
                            console.log(response.successCount + ' notifications were sent successfully');
                   })

                     }
       }

      

       res.send({'request_id':request_id,'receiver_number':userlist.length})

})


module.exports=router;