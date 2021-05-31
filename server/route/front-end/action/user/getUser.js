const express = require('express')
const router = express.Router()



router.post('/',async (req,res)=>{
    var params = req.body;
    let sql = ``
    var user_id=0
    var result = []
    if(params.Email){
        sql = `select * from user where Email='${params.Email}'`
        result = await req.execute(sql)
        user_id = result[0]['UserId']
    }

    if(params.UserId){
        sql = `select * from user where UserId='${params.UserId}'`
        result = await req.execute(sql)
        user_id = params.UserId

    }
   

    let keywords_sql = `select keyword.KeywordContent as KeywordContent, keyword.KeywordId as KeywordId 
                    from keyword
                    inner join user_keyword_relationship
                    on keyword.KeywordId = user_keyword_relationship.KeywordId
                    where user_keyword_relationship.UserId ='${user_id}'`
    
    var keywords =await req.execute(keywords_sql)

    //check if Photo exists
    if(result[0].PhotoPath){
        var photo_name = result[0].PhotoPath.split('|').pop()
        var photo = req.Path.resolve(__dirname,'../../../../public','images',photo_name)
        try {
            if (!req.fs.existsSync(photo)) {
                console.log('not exist!s')
            //file not exists
            result[0].PhotoPath=""
            }
        } catch(err) {
            console.error(err)
        }
    }else{
        result[0].PhotoPath=""
    }

    result[0]['keywords'] = []
    for(var i=0;i<keywords.length;i++){
        result[0]['keywords'].push(keywords[i])
    }
    console.log('getUser.js result is ',result[0])
    res.send(result[0])
    
})

module.exports=router