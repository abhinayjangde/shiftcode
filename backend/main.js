const user = {
    fullname: "Abhi",
    age: 23,
    email: "abhi@gmail.com"
}

for(const [key, value] of Object.entries(user)){
    console.log(`${key} : ${value}`)
}