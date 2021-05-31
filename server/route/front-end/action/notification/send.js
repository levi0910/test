const express = require('express')
const router = express.Router()


router.post('/',async(req,res)=>{
    var params = req.body
    var user_store = await req.admin.firestore().collection('users').doc(params.userid).get()
    switch(params.type){
        case 'logout':
            req.admin.messaging().sendMulticast({
                data: {logout:'Someone liked you '},
                tokens: [user_store['_fieldsProto']['notificationTokens']['stringValue']],
            })
                .then(async (response) => { 
                    req.admin.firestore().collection('users').doc(params.userid).delete()  
                    .then(() => {
                        console.log('User deleted!');
                        res.send({status:true})
                                 });
                   
            })
            break;
        default:
            res.send({status:false,message:'invalid message type'})

    }
       


})


module.exports=router;