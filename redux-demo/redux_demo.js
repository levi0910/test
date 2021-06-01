
const createStore = (initialState)=>{
    var state = initialState
    var listeners = []
    
    function subscribe(listener){
        console.log(typeof(listener))
        listeners.push(listener)
    }


    
    function changeCount(newState){
        state = newState;
    
        for(let i=0;i<listeners.length;i++){
            let listen = listeners[i]
            listen()
        }
    }
    
    function getState(){
        return state
    }
    
    return {
        subscribe,
        getState,
        changeCount
    }

}


const combineReducers = (reducers)=>{
    const reducer_keys = Object.keys(reducers)

    console.log(reducer_keys)
}

module.exports={
    createStore:createStore,
    combineReducers:combineReducers
} ;
