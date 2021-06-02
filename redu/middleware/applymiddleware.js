const store = require('../re-deux/redux_demo')

const applyMiddleware = (...middlewares) => {


    return function(createStore){
        return function(reducer,initialState){


            var store = createStore(reducer,initialState)

           


            var dispatch = store.dispatch

  
            middlewares.map(middleware=>{
                dispatch = middleware(store,dispatch)
            })


            // array.reverse().map(func=>{
            //     dispatch = func(dispatch)
            // })



            store.dispatch = dispatch

            return store
        }
    }
    




    /*return createStore function */
}


/*
var store = store.createStore(reducer,applyMiddleware(m1,m2,m3))
result:
    store.dispatch(){
        middle1,
        middle2,
        middle3.
        dispatch()
}

*/

module.exports={
    applyMiddleware:applyMiddleware
}