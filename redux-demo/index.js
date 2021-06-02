const redux = require('redux')
const createStore = redux.createStore


const BUY_CAKE = 'BUY_CAKE'
const BUY_ICECREAM = 'BUY_ICECREAM'


function buyCake(){
    return {
        type:BUY_CAKE,
        info:'First redux action'
    }
}

function buyIcecream(){
    return{
        type:BUY_ICECREAM,
        info:'ice cream'
    }
}



// const initialState ={
//     numOfCakes:10,
//     numOfIcecreams:20
// }


const initialIcecreamState = {
    numOfIcecream:10
}

const initialCakeState = {
    numOfCake:10

}
// const reducer = (state = initialState,action)=>{
//     switch(action.type){
//         case BUY_CAKE:return{
//             ...state,
//             numOfCakes:state.numOfCakes-1
//         }

//         default:return state
            
//     }
// }

const iceCreamReducer = (state=initialIcecreamState,action)=>{
    switch(action.type){
        case BUY_ICECREAM: return {
            ...state,
            numOfIcecream:numOfIcecream-1
        }

        default: return state
    }

}

const cakeReducer = (state=initialCakeState,action)=>{
    switch(action.type){
        case BUY_CAKE: return {
            ...state,
            numOfCake:numOfCake-1
        }

        default: return state
    }

}

const store = createStore(reducer)

console.log('initial state ',store.getState())

const unsubscribe = store.subscribe(()=>{
    console.log('updated state is ',store.getState())
})

console.log('unsubscribe is ',unsubscribe)

store.dispatch(buyCake())
store.dispatch(buyCake())
store.dispatch(buyCake())
unsubscribe()