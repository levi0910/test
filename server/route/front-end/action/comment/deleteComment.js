const {connection,execute} = require('../../../../mysql/actions/connection')

module.exports = async(req,res)=>{
    var comment_id = req.params.comment_id;
    //console.log(videoId)
    let sql = `delete from comment where CommentId='${comment_id}'`

    var result = await req.execute(sql)
    res.send('successfully deleted!') 
}