const redux = require('./re-deux/redux_demo')
const action_type = require('./data/action')
const {countReducer,infoReducer} = require('./reducers')
const {applyMiddleware} = require('./middleware/applymiddleware')
const hello = require('./middleware/printHelloMiddleWare')
const show = require('./middleware/showStateMiddleWare')

const createStore = redux.createStore





const reducer = redux.combineReducers({
    counter:countReducer,
    info:infoReducer
})

/*change the store.dispatch function 
  applyMiddleware() returns a store function
*/
const store = createStore(reducer,applyMiddleware(hello,show))

console.log(store.getState())

store.subscribe(()=>{
    let state = store.getState();
    // console.log('index page state result is ',state)
})

store.dispatch({
    type:action_type.INCREMENT
})

store.dispatch({
    type:action_type.INCREMENT
})

store.dispatch({
    type:action_type.DECREMENT
})



store.dispatch({
    type:action_type.SET_NAME,
    name:'woshishabi'
})

store.dispatch({
    type:action_type.SET_DESCRIPTION,
    description:'dddddddd'
})


