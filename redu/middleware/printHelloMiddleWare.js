module.exports=(store,next)=>{
    return function(action){
        console.log('hello')
        next(action)
    }
    
}