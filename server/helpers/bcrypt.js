const bcrypt = require("bcryptjs")

const hashPassword = (password) => {
    return bcrypt.hashSync(password)
}

const comparePassword = (password, hashed) => {
    return bcrypt.compareSync(password, hashed)
}

module.exports = {
    hashPassword, comparePassword
}