
const createStore = (reducer,initialState,applyMiddleware)=>{
    if(typeof(initialState)=='function'){
        let temp = applyMiddleware
        applyMiddleware=initialState
        initialState=temp
    }
    if(applyMiddleware){
        const newCreateStore = applyMiddleware(createStore)

        return newCreateStore(reducer,initialState)
    }
    var state = initialState
    var listeners = []


    
    function subscribe(listener){
        listeners.push(listener)
    }


    
    function dispatch(action){
       
        state = reducer(state,action)
      
        for(let i=0;i<listeners.length;i++){
            let listen = listeners[i]
           
            listen()
        }
    }
    
    function getState(){
        return state
    }
    
    dispatch({type:Symbol()})

    return {
        subscribe,
        getState,
        dispatch
    }

}


const combineReducers = (reducers)=>{
    const reducer_keys = Object.keys(reducers)

    return function combination(state={},action){

        const state_result = {}

        for(let i=0;i<reducer_keys.length;i++){

            var reducer_key = reducer_keys[i]
            var sub_state = state[reducer_key]
            const reducer = reducers[reducer_key]

            state_result[reducer_key] = reducer(sub_state,action)

        }

        return state_result;

    }

    
    
}

module.exports={
    createStore:createStore,
    combineReducers:combineReducers
} ;
