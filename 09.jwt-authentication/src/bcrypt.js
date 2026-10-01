import bcrypt from "bcryptjs"

const password = "hello123"

const hash = await bcrypt.hash(password, 10)

console.log("Password" , password);
console.log("hash" , hash);

const correct = await bcrypt.compare(
    "hello123",
    hash
)

const wrong = await bcrypt.compare(
    "wrongpassword",
    hash
)

console.log("Correct password : " , correct);
console.log("Wrong password" , wrong);



