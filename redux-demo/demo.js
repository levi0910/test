const redux = require('./redux_demo')

const createStore = redux.createStore


let initState = {
    counter: {
      count: 0
    },
    info: {
      name: '',
      description: ''
    }
  }

const store = createStore(initState)

store.subscribe(()=>{
    let state = store.getState();
    console.log(state)
})

store.changeCount(
    {
        ...store.getState(),
        info:{
            name:'sb',
            description:'please offer me a job'
    }
}
)


redux.combineReducers({dasima:'fdaffdf',fasf:'fdas'})