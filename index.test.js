const goblox = require('./lib/main.js')

async function test() {
    const account = await new goblox.loginCookie("_|WARNING:-DO-NOT-SHARE-THIS...").catch(console.error);

    console.log(account) //undefined
    goblox.getAccountInfo("fastering18").then(re=>{
        console.log(JSON.stringify(re))
        goblox.getStatus(re.UserId).then(r=>{
            console.log(JSON.stringify(r))
        });
    });
    
    goblox.devforum.getUser(467971019).then(console.log).catch(console.log)
}
test()
