const fetch = require("node-fetch")
const { getUserFromId } = require("./util/validUser")

const BaseUserURL = "https://devforum.roblox.com/u/" // always end with .json
const devforum = {}

// devforum only accept roblox name, you can specify it as number if you want to get from user id
devforum.getUser = function (name) {
    return new Promise(async (resolve, reject) => {
        if (!name) return reject("#1 devforum getUser require name as string");
        const id = name
        if (typeof (name) == "number") {
            try {
                name = await getUserFromId(name).catch(reject)
                name = name.name
            } catch (errr) {
                return reject(errr)
            }
        }
        fetch(BaseUserURL + name.toLowerCase() + ".json").then(res => res.json().then(resolve).catch(err => {
            if (err.error_type && err.error_type == "not_found") return reject("User is not devforum member");
            return reject(err);
        }))
    })
}

module.exports = devforum;
