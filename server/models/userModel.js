const { getDB } = require("../config/mongodb")

class UserModel {

    static collection() {
        return getDB.collection("User")
    }

    static async userById() {
        return this.collection()
    }
}

module.exports = UserModel