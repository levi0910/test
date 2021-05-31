const express = require('express')
const router = express.Router()


const updateKeyword =async(keyword_id,keyword,req)=>{
  console.log('user.js updated keyword is ',keyword)
  if(keyword_id!='new'){
    let sql = `update keyword set KeywordContent = '${keyword}' where KeywordId='${keyword_id}'`
    await req.execute(sql)
  }else{
    let id_sql = `select uuid()`
    let id_result = await req.execute(id_sql)
    let id = id_result[0]['uuid()']
    let sql = `insert into keyword (KeywordId,KeywordContent) values('${id}','${keyword}')`
    await req.execute(sql)

    let user_keyword_sql = `insert into user_keyword_relationship (UserId,KeywordId) values('${req.body.UserId}','${id}')`
    await req.execute(user_keyword_sql)
  }
  
}



router.post('/',async (req,res)=>{
    /*
        req.body:{
            'NickName'
            'Email':
            'keywords':[{KeywordContent,KeywordId},{KeywordContent,KeywordId},{KeywordContent,KeywordId}....]
            'City'
            'UserId'
            'PhotoPath':'|images|upload_b0219a046af211612736c29a7c316209.jpg'
        }
    */
  
    var params = req.body;
    console.log('params is ',params)

    
  var parameter = ``

    //delete previous images if it exists
    if(params.PhotoPath){
      parameter += `PhotoPath='${params.PhotoPath}',`
      var pre_photopath_sql =`select PhotoPath from user where user.UserId = '${params.UserId}'`

      var pre_photopath_result = await req.execute(pre_photopath_sql)

      var pre_photopath = pre_photopath_result[0].PhotoPath


      if(pre_photopath && pre_photopath!='undefined'&&pre_photopath!=params.PhotoPath){
        console.log('if pre visited!')
        pre_photopath = req.Path.resolve(__dirname,'../../../../public','images',pre_photopath.split('|').pop())   
        try {
            req.fs.unlinkSync(pre_photopath)
            //file removed
          } catch(err) {
            console.error('err')
          }
        }
      }

    
    if(params.Email)
      parameter += `Email='${params.Email}',`

    if(params.NickName)
      parameter += `UserName='${params.NickName}',`

    if(params.City)
      parameter += `City='${params.City}',`

    if(params.Country)
      parameter += `Country='${params.Country}',`

    if(params.Province)
      parameter += `Province='${params.Province}',`

    if(params.Membership)
      parameter += `Membership='${params.Membership}',`

    if(params.RequestCount)
      parameter += `RequestCount=RequestCount-1,`

    


    //UserName='${params.NickName}',Email='${params.Email}',City='${params.City}',Country = '${params.Country}',PhotoPath= '${params.PhotoPath}'
    //insert  user information
    if(parameter!=''){
      let sql = `update user set `+parameter.slice(0,-1)+ ` where UserId='${params.UserId}'`

      await req.execute(sql)
    }

  if(params.keywords){
    for(var i=0;i<params.keywords.length;i++){
      await updateKeyword(params.keywords[i].KeywordId,params.keywords[i].KeywordContent,req)
    }
  }
    
   
   
    
    res.send('ok')
  
    
})

module.exports=router