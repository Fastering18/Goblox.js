const fetch = require("node-fetch")
// get user from id
const baseURLuser = "https://users.roblox.com/v1/users/"

const UserUtil = {}

UserUtil.getUserFromId = function(id) {
    return new Promise((resolve, reject) => {
        fetch(baseURLuser + id).then(res => res.json())
        .then((akun) => {
            if (!akun || !akun.name) return reject("User not found");
            return resolve(akun)
        }).catch(reject)
    })
}

module.exports = UserUtil;
