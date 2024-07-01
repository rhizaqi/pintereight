const { ObjectId } = require("mongodb");
const { getDB } = require("../config/mongodb");
const { hashPassword } = require("../helpers/bcrypt");

async function seedUser() {
  try {
    const data = require("../data/dataUser.json");

    data = data.map((el) => {
      el.password = hashPassword(el.password);
      return el;
    });

    const db = await getDB();

    await db.collection("User").insertMany(data);
  } catch (error) {
    console.log(error, `error di seed user`);
  }
}

module.exports = seedUser;
