const goblox = require('./lib/main.js')

async function test() {
    const account = await new goblox()
    console.log(account.Username) //undefined
    account.getAccountInfo("fastering18").then(r=>{
        console.log(JSON.stringify(r))
    })
}
test()
