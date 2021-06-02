const action_type=require('../data/action')

const initstate={
    name: '',
    description: ''
  }

const infoReducer = (state,action)=>{
    if(!state){
        state = initstate
    }
    switch(action.type){
        case action_type.SET_NAME : return {
            ...state,
            name:action.name
        }

        case action_type.SET_DESCRIPTION : return {
            ...state,
            description:action.description
        }

        default: return state
    }
}

module.exports=infoReducer