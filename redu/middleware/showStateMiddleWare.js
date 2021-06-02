

module.exports=(store,next)=>{
    return function(action){
        console.log('the state middleware is ',store.getState())
        next(action)
    }
    
}