
const action_type=require('../data/action')
const initstate = {
    count: 0
  }


const countReducer = (state,action)=>{

    if(!state){
        state = initstate
    }
    switch(action.type){
        case action_type.INCREMENT : return {
            ...state,
            count:state.count+1
        }

        case action_type.DECREMENT : return {
            ...state,
            count:state.count-1
        }

        default: return state
    }
}

module.exports=countReducer