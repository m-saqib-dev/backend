const User = require("../userSchema");

async function signUp(user) {
    try {
        const newUser = await User.create({ ...user });
        return newUser;
    } catch (err) { 
        throw err;
    }
}
module.exports = signUp;