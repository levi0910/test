const express = require('express')
const router = express.Router()



router.post('/',async (req,res)=>{
    var params = req.body;
    req.form.uploadDir = req.Path.resolve(__dirname,'../../../../public','files')

    req.form.keepExtensions=true

    req.form.parse(req,async(err,fields,files)=>{
        console.log(files)
        if(files.headPhoto){
            
            var new_path = req.Path.resolve(__dirname,'../../../../public','images',files.headPhoto.name)
            console.log('old path is ',files.headPhoto.path,'new path is ',new_path)

            await req.fs.rename(files.headPhoto.path, new_path, function (err) {
                if (err) throw err
                console.log('Successfully renamed - AKA moved!')
                })

            res.send({
                path:new_path
            })
        }
        if(files.requestPhoto){
            
            var new_path = req.Path.resolve(__dirname,'../../../../public','RequestImages',files.requestPhoto.name)
            console.log(new_path)

            await req.fs.rename(files.requestPhoto.path, new_path, function (err) {
                if (err) throw err
                console.log('Successfully renamed - AKA moved!')
                })

            res.send({
                path:new_path
            })
        }
        if(files.video){
           
            var new_path = req.Path.resolve(__dirname,'../../../../public','videos',files.video.name)
            console.log(new_path)

            await req.fs.rename(files.video.path, new_path, function (err) {
                if (err) throw err
                console.log('Successfully renamed - AKA moved!')
                })

            res.send({
                path:new_path
            })
        }

        if(files.videoImage){
           
            var new_path = req.Path.resolve(__dirname,'../../../../public','videoImages',files.videoImage.name)
            console.log(new_path)

            await req.fs.rename(files.videoImage.path, new_path, function (err) {
                if (err) throw err
                console.log('Successfully renamed - AKA moved!')
                })

            res.send({
                path:new_path
            })
        }
 

    })
})

module.exports=router