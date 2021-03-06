# Goblox.js

Unoffical ROBLOX API wrapper made by Fastering18.

**Example**

```js
const goblox = require("goblox.js");

async function test() {
    const account = await new goblox.loginCookie("_|WARNING:-DO-NOT-SHARE-THIS...").catch(console.error);

    console.log(account) //undefined because cookie parameter isn't correct/null

    goblox.getAccountInfo("fastering18").then(re=>{
        console.log(JSON.stringify(re))  //No need cookie parameter
    }).catch(console.log);

    goblox.getStatus("fastering18").then(r=>{
        console.log(JSON.stringify(r))   //No need cookie parameter
    }).catch(console.log);

    goblox.devforum.getUser(467971019).then(devforumUser => {
        console.log(JSON.stringify(devforumUser))   //No need cookie parameter
    }).catch(console.log);
}
test()
```

object result for **getAccountInfo()** will be:

`{"UserId":467971019, "Username":"Fastering18", "Description":"Fastering18 from yt", "Status":"A back-end developer that learn something quicker."}`

object result for **getStatus()** will be:

`{"Status":"A back-end developer that learn something quicker."}`


**Functions**

`const account = await new goblox.loginCookie("_|WARNING:-DO-NOT-SHARE..."); //fill it with your full ROBLOSECURITY (optional)`

Put the first parameter with your .ROBLOSECURITY cookie,
NOTE: roblox token is not required if you only need general account info, will not include more information like presences/etc.

`account.getAccountInfo("fastering18")`

First parameter is the name of ROBLOX username/user id, if its empty, then it return current information of current .ROBLOSECURITY cookie

`goblox.getStatus("fastering18")`

First parameter is the name of ROBLOX username/user id, return status of the user.

`goblox.devforum.getUser("fastering18")`

First parameter is the name of ROBLOX username/user id, return devforum information of the user.  
  
Discord: Kei#4517,<br>
Roblox: Fastering18,<br>
Updates: added devforum.getUser and fixed pakage.json,<br>
Test: npm test<br>
