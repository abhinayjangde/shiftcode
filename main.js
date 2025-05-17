const expected_outputs = ["1","2","4","12"]

const stdout = ["1","2","4","12"]


const isPassed = stdout.every((test, index)=>{
    if(stdout.length !== expected_outputs.length) return false
    return test === expected_outputs[index]
})

console.log(isPassed)