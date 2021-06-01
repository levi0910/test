const arr = [1,2,3,4,5,6,7,8,9]

var result = arr.map((value,index)=>{
    return {number:value,result:index}
})

console.log(result)