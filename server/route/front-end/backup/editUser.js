const express = require('express')
const router = express.Router()



const deleteKeyword = async(keyword_id,req)=>{
  let sql_delete_relationship = `delete from user_keyword_relationship where KeywordId='${keyword_id}'`
  await req.execute(sql_delete_relationship)
  let sql_delete_keyword = `delete from keyword where KeywordId='${keyword_id}'`
  await req.execute(sql_delete_keyword)
}
const clearKeywords = async(arr,req)=>{
  arr.forEach(element=>{
    deleteKeyword(element)
  })
}

const updateKeyword =async(keyword_id,keyword,req)=>{
  console.log('user.js updated keyword is ',keyword)
  if(keyword==""){
    deleteKeyword(keyword_id,req)
  }else{
    let sql = `update keyword set KeywordContent = '${keyword}' where KeywordId='${keyword_id}'`
    await req.execute(sql)
  }
}

const insertKeyword = async(keyword,user_id,req) =>{
  if(keyword!="" && keyword){
    let sql_id = `select uuid()`
    var resultId = await req.execute(sql_id)
    var keyword_id = resultId[0]['uuid()']
    let sql_keyword = `insert into keyword (KeywordId,KeywordContent) values('${keyword_id}','${keyword}')`
    await req.execute(sql_keyword)
    let sql_relationship = `insert into user_keyword_relationship (UserId,KeywordId) values('${user_id}','${keyword_id}')`
    await req.execute(sql_relationship)
  }
}


router.post('/',async (req,res)=>{
    /*
        req.body:{
            'NickName'
            'Email':
            'keywords':{KeywordContent,KeywordId}
            'City'
            'UserId'
            'PhotoPath':'|files|upload_b0219a046af211612736c29a7c316209.jpg'
        }
    */
  
    var params = req.body;
    console.log('params is ',params)



    //delete previous images if it exists

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


    //remove the images stored in files folder to images folder

    var name = undefined

    if(params.PhotoPath)
      name = params.PhotoPath.split('|').pop()

    
    if(name){
      console.log('name is ',name)
      var new_path = req.Path.resolve(__dirname,'../../../../public','images',name)
      
      var old_path = req.Path.resolve(__dirname,'../../../../public','files',name)
      if (req.fs.existsSync(old_path)) {
          //file exists
          req.fs.rename(old_path, new_path, function (err) {
              if (err) throw err
              console.log('Successfully renamed - AKA moved!')
              })
          
        }
       params.PhotoPath = '|'+new_path.split('\\').slice(-2).join('|')
    }

    //insert  user information
    let sql = `update user 
               set UserName='${params.NickName}',Email='${params.Email}',City='${params.City}',Country = '${params.Country}',PhotoPath= '${params.PhotoPath}'
               where UserId='${params.UserId}'`
    await req.execute(sql)


    //update keywords

    //the new keywords from front-end
    var new_keywords =[params.Keyword1,params.Keyword2,params.Keyword3]

    //select the user's previous keywords from database
    let sql_keyword = `select keyword.KeywordContent as keyword, user_keyword_relationship.KeywordId as keyword_id
    from user_keyword_relationship
    inner join user
    on user_keyword_relationship.UserId = user.UserId
    inner join keyword
    on keyword.KeywordId = user_keyword_relationship.KeywordId
    where user.UserId ='${params.UserId}'`
    var keyword_result = await req.execute(sql_keyword)
    console.log('editUser.js keyword_result are ',keyword_result)
    var pre_keywords = {}

    //conver the result in form pre_keywords:{   keywords:keyword_id.....}
    keyword_result.forEach(element => {
      pre_keywords[element.keyword] = element.keyword_id
    });

    console.log('editUser.js pre_keywords are ',pre_keywords)

    //remove the keywords that already existed
    var update_index = []
    new_keywords.forEach((element,index) => {
      if(Object.keys(pre_keywords).includes(element)){
          delete pre_keywords[element]
      }else{
        update_index.push(index)
      }
       
    })
    console.log('update index is ',update_index)
    var update_keyword_value = []
    update_index.forEach((element)=>{
      update_keyword_value.push(new_keywords[element])
    })
    console.log('editUser.js update_keyword_value final is ',update_keyword_value)
    console.log('editUser.js final pre_keywords is ',pre_keywords)


    if(update_keyword_value.length==Object.values(pre_keywords).length){
      for(var i=0;i<Object.keys(pre_keywords).length;i++){
        var keyword_id = pre_keywords[Object.keys(pre_keywords)[i]]
        console.log('updated keyword_id is ',keyword_id)
        await updateKeyword(keyword_id,update_keyword_value[i],req)
      }
    }else{
      clearKeywords(Object.keys(pre_keywords),req)
      update_keyword_value.forEach(element=>{
        insertKeyword(element,params.UserId,req)
      })
    }
    
   
   
    
    res.send('ok')
  
    
})

module.exports=router