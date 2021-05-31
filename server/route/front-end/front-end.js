const express = require('express')


const front = express.Router()




front.use('/login',require('./login'))



front.use('/comment',require('./action/comment/comment'))
front.use('/home',require('./action/homepage/home'))
front.use('/like',require('./action/homepage/like'))
front.use('/getRequest',require('./action/request/getRequest'))

front.use('/getComment',require('./action/comment/content'))

front.use('/videoRecommendation',require('./action/request/recommend'))
front.use('/sendRequest',require('./action/request/sendRequest'))

front.use('/getResponses',require('./action/request/getResponse'))

front.use('/addUser',require('./action/user/addUser'))

front.use('/deleteRequest',require('./action/request/deleteRequest'))

front.use('/deleteComment/:comment_id',require('./action/comment/deleteComment'))

front.use('/likeMessage',require('./action/message/likeMessage'))
front.use('/commentMessage',require('./action/message/commentMessage'))

front.use('/addHistory',require('./action/viewhistory/addHistory'))
front.use('/deleteHistory',require('./action/viewhistory/deleteHistory'))

front.use('/getUser',require('./action/user/getUser'))
front.use('/addUserExperience',require('./action/user/addUserExperience'))
front.use('/editUser',require('./action/user/editUser'))

front.use('/upload',require('./action/upload/upload'))
front.use('/readComment',require('./action/comment/readComment'))
front.use('/deleteResponse',require('./action/request/deleteResponse'))
front.use('/addVideo',require('./action/video/addVideo'))



front.use('/getCreatedVideo',require('./action/video/getCreatedVideo'))
front.use('/getLikedVideo',require('./action/video/getLikedVideo'))
front.use('/getPrivateVideo',require('./action/video/getPrivateVideo'))

front.use('/deleteVideo',require('./action/video/deleteVideo'))

front.use('/searchVideos',require('./action/video/searchVideo'))

front.use('/addVideoViews',require('./action/video/addVideoViews'))

front.use('/Message',require('./action/message/Message'))
front.use('/deleteMessage',require('./action/message/deleteMessage'))

front.use('/verifyUser',require('./action/user/verifyUser'))

front.use('/readResponse',require('./action/request/readResponse'))

front.use('/sendNotification',require('./action/notification/send'))

//front.use()


module.exports=front;