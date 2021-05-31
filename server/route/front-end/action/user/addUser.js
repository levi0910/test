const express = require('express')
const router = express.Router()

const UserSchema = {
    UserName:String,
    PassWord:String,
    Email:String,
    City:String,
    Country:String,
    Age:Number,
    Province:String
}

const addKeywords =async(num,user_id,req,Keywords)=>{
    var ids = []
    for(var i=0;i<num;i++){
        //generate id and get it
        let id_sql = `select uuid()`
        let id_result = await req.execute(id_sql)
        let id = id_result[0]['uuid()']
        //insert empty keywords into keyword table
        let keyword_insert=''
        if(Keywords[i]){
             keyword_insert = `insert into keyword (KeywordId,KeywordContent) values('${id}','${Keywords[i]}')`
        // else
        //     keyword_insert = `insert into keyword (KeywordId,KeywordContent) values('${id}','')`
                await req.execute(keyword_insert)

        //generate connection bewteen keyword and the user

                let relation_sql = `insert into user_keyword_relationship (UserId,KeywordId) values('${user_id}','${id}')`
                await req.execute(relation_sql)

                ids.push[id]
        }

    }
    return ids
}

function transform(params){
    var columns='';
    var values = '';
    for(var i =0;i<Object.keys(params).length;i++){
        let columnsItem =''
        let valuesItem =''
        if(Object.keys(params)[i]!='Keywords'){
        if(UserSchema[Object.keys(params)[i]]==String && params[Object.keys(params)[i]]!=''){
            columnsItem = Object.keys(params)[i] +','
            valuesItem = `'${params[Object.keys(params)[i]]}',`  
        }

        if(UserSchema[Object.keys(params)[i]]==Number && params[Object.keys(params)[i]]!=0){
                columnsItem = Object.keys(params)[i]+','
                valuesItem = params[Object.keys(params)[i]]+','
        }

        columns += columnsItem
        values += valuesItem   
    }  
    }
    columns = columns.slice(0,-1)
    values = values.slice(0,-1)
    return [columns,values]
}

router.post('/',async (req,res)=>{
    var params = req.body;
    console.log(params)
    var data=transform(params)
    console.log(data)

    let id_sql = `select uuid()`
    let id_result = await req.execute(id_sql)
    let id = id_result[0]['uuid()']

    data[0] = data[0] +',UserExperience,RequestCount'
    data[1] = data[1]+',0,0'

    var sql = `insert into user (UserId,${data[0]}) values('${id}',${data[1]})`
    console.log(sql)
//    try{
//    req.pool.getConnection(function(err, connection){
//        
//        if (err) {
//            console.log('connection errors!')
//            //reject(err)
//        } else {
//            connection.query(sql, (err, fields) => {
//                if (err){
//                        //var message = err.sqlMessage
//                        //res.sendStatus({'message':'duplicated','status':false})
//                        console.log(err.errno)
//                    
//                    //reject(err.errno)
//                } 
//                else {
//                    console.log(0)
//                    //res.send(0)
//                }
//                connection.release();
//            })
//        }
//    })
//}catch(err){
//    throw error
//}
	var check_sql = `select * from user where UserName='${params.UserName}'`

	var check_result = await req.execute(check_sql)

    if(check_result.length==0){
	    var result = await req.execute(sql)
	    // console.log('resul is ',result)
	    var data = {'city':params.City,'country':params.Country}
	    //var result = await req.fetch('POST','http://localhost:5000/inform',data)
	    //console.log(result)
	    if(params.Keywords)
	        await addKeywords(params.Keywords.length,id,req,params.Keywords)
	    
	
        await req.fetch('GET',`http://34.68.41.157/add-weather-info?city=${params.City}&country=${params.Country}&province=${params.Province}`)
	    res.send({'message':'success!','status':true})
    }else{
    		res.send({'message':'duplicated username','status':false})
    }
    //res.send({'message':'test',status:false})
})

module.exports=router