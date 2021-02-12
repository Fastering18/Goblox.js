/*
   File Name: main.js
   Author: Fastering18
   Description: Main library script
*/
const fetch = require("node-fetch")
const devforum = require("./devforum")

const roblox = {
    devforum: devforum,
    loginCookie: class cookieLogin {
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
                        return resolve(this)
                        /*} else {
                            this.status = "Internal Problem"
                            reject(new Error("Failed to login, 500 Internal Server Error"));
                        }*/
                    }).catch(err => {
                        this.status = "Internal Problem"
                        reject("Failed to login Roblox, invalid .ROBLOSECURITY token provided, please provide correct cookie.");
                    })
            });
        }
        getAccountInfo(UsernameOrUserId) {
            return new Promise((resolve, reject) => {
                if (!UsernameOrUserId && this.status !== "logined") reject(new Error(`Cannot get your user data, ${this.status}`));
                const options = this.options
                let resr = null
                const tokenRBX = this.cookie
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
                                        const presenceURL = `https://presence.roblox.com/v1/presence/users`
                                        const optionPostPresences = {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                                cookie: `.ROBLOSECURITY=${tokenRBX}`
                                            },
                                            body: JSON.stringify({
                                                "userIds": [
                                                    UserId
                                                ]
                                            })
                                        }
                                        fetch(presenceURL, optionPostPresences)
                                            .then(res => res.json())
                                            .then((result3) => {
                                                AccountInfo = {
                                                    UserId: result.id,
                                                    Username: result.name,
                                                    Description: result.description,
                                                    Status: result2.status,
                                                    presence: result3.userPresences[0]
                                                }
                                                console.log(result3)
                                                console.log(UserId)
                                                resolve(AccountInfo)
                                            }).catch(err => {
                                                reject(`Cannot get your user data, ${err}`)
                                            })
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
                                    reject(`Cannot get your user data, ${err}`)
                                })
                        }).catch(err => {
                            reject(`Cannot get your user data, ${err}`)
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
    },
    getAccountInfo: function getAccountInfo(UsernameOrUserId) {
        return new Promise((resolve, reject) => {
            if (!UsernameOrUserId) reject(new Error(`Cannot get your user data, please provide name or user id.`));
            let AccountInfoURL = `https://users.roblox.com/v1/users/`
            let AccountInfo = null
            const options = {
                method: 'Get',
                headers: { 'Content-Type': 'application/json' }
            }
            function getInfo(id) {
                fetch(AccountInfoURL + id, options)
                    .then(res => res.json())
                    .then((result) => {
                        let StatusURL = `${AccountInfoURL + id}/status`
                        fetch(StatusURL, options)
                            .then(res => res.json())
                            .then((result2) => {
                                const AccountInfo = {
                                    UserId: result.id,
                                    Username: result.name,
                                    Description: result.description,
                                    Status: result2.status,
                                    JoinDate: new Date(result.created).getTime()
                                }
                                resolve(AccountInfo)
                            })
                    }).catch(err => {
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
                            .then((resultName) => {
                                if (!resultName || !resultName.data || resultName.data.length <= 0) return reject(new Error(`User not found`));
                                const id = resultName.data[0].id
                                getInfo(id)
                            }).catch(err => {
                                reject(new Error(`User not found.`));
                            })
                    })
            }
            getInfo(UsernameOrUserId)
        })
    },
    getStatus: function getAccountStatus(nameOrid) {
        return new Promise((resolve, reject) => {
            if (!nameOrid) reject(new Error(`Cannot get your user status, please provide name or user id.`));
            let AccountInfoURL = `https://users.roblox.com/v1/users/`
            const options = {
                method: 'Get',
                headers: { 'Content-Type': 'application/json' }
            }
            function getStatus(id) {
                fetch(AccountInfoURL + id + "/status", options)
                    .then(res => res.json())
                    .then((result) => {
                        if (result.errors) return tolol;
                        resolve(result)
                    }).catch(err => {
                        const accountURL = `https://users.roblox.com/v1/usernames/users`
                        const body = {
                            "usernames": [
                                nameOrid
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
                            .then((resultName) => {
                                if (!resultName || !resultName.data || resultName.data.length <= 0) return reject(new Error(`User not found`));
                                const id = resultName.data[0].id
                                getStatus(id)
                            }).catch(err => {
                                console.log(err)
                                reject(new Error(`User not found.`));
                            })
                    })
            }
            getStatus(nameOrid)
        })
    }
    
};

module.exports = roblox;
