/*
   File Name: main.js
   Author: Fastering18
   Description: Main library script
*/

const fetch = require("node-fetch")

class cookieLogin {
    constructor(token) {
        if (!token) {
            this.status = "not logined"
            this.options = {
                method: "Get"
            }
            return;
        }
        return new Promise((resolve, reject) => {
            const loginURL = "https://www.roblox.com/mobileapi/userinfo"
            const options = {
                method: "Get",
                headers: {
                    cookie: `.ROBLOSECURITY=${token}`
                }
            }
            fetch(loginURL, options)
                .then(res => res.json())
                .then((result) => {
                    if (!result.UserID && !result.UserName && !result.UserName) {
                        this.status = "Invalid cookie"
                        return reject(new Error("Failed to login, please provide full .ROBLOSECURITY cookie"));
                    }

                    this.cookie = token
                    this.status = "logined"
                    this.options = options
                    this.UserId = result.UserID
                    this.Username = result.UserName
                    this.Balance = result.RobuxBalance
                    this.Thumbnail = result.ThumbnailUrl
                    this.Premium = result.IsPremium
                    resolve(this)
                    /*} else {
                        this.status = "Internal Problem"
                        reject(new Error("Failed to login, 500 Internal Server Error"));
                    }*/
                }).catch(err => {
                    this.status = "Internal Problem"
                    reject(new Error(err));
                })
        });
    }
    getAccountInfo(UsernameOrUserId) {
        return new Promise((resolve, reject) => {
            if (!UsernameOrUserId && this.status !== "logined") reject(new Error(`Cannot get your user data, ${this.status}`));
            const options = this.options
            let resr = null
            function getData(UserId, cookieEnabled) {
                let AccountInfoURL = `https://users.roblox.com/v1/users/${UserId}`
                let AccountInfo = null
                fetch(AccountInfoURL, options)
                    .then(res => res.json())
                    .then((result) => {
                        let StatusURL = `${AccountInfoURL}/status`
                        fetch(StatusURL, options)
                            .then(res => res.json())
                            .then((result2) => {
                                if (cookieEnabled === true) {
                                    AccountInfo = {
                                        UserId: result.id,
                                        Username: result.name,
                                        Description: result.description,
                                        Status: result2.status,
                                        /*UserId: this.UserId,
                                        Username: this.Username,
                                        Balance: this.Balance,
                                        Profile: this.Thumbnail,
                                        Premium: this.Premium
                                        */
                                    }
                                    resolve(AccountInfo)
                                } else {
                                    AccountInfo = {
                                        UserId: result.id,
                                        Username: result.name,
                                        Description: result.description,
                                        Status: result2.status
                                    }
                                    resolve(AccountInfo)
                                }
                                
                            }).catch(err => {
                                reject(new Error(`Cannot get your user data, ${err}`))
                            })
                    }).catch(err => {
                        reject(new Error(`Cannot get your user data, ${err}`))
                    })
            }
            if (!UsernameOrUserId && this.status === "logined") {
                getData(this.UserId, true)
            } else if (UsernameOrUserId) {
                const accountURL = `https://users.roblox.com/v1/usernames/users`
                const body = {
                    "usernames": [
                        UsernameOrUserId
                    ],
                    "excludeBannedUsers": false
                }
                const option = {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: { 'Content-Type': 'application/json' }
                }
                fetch(accountURL, option)
                    .then(res => res.json())
                    .then((result) => {
                        if (!result || !result.data || result.data.length <= 0) return reject(new Error(`User not found`));
                        const id = result.data[0].id
                        getData(id, this.status == "logined")
                    })
            }
        })
    }
}

var goblox = {
    generateMeme: function (negara) {
        console.log(Object.keys(Meme).length)
        return Meme[Math.round(random(0, Object.keys(Meme).length - 1))]
    },

}

module.exports = cookieLogin
