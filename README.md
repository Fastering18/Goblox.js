# Goblox.js
Unoffical ROBLOX API wrapper made by Fastering18.


**Example**
```
const goblox = require('goblox.js');

async function test() {
    const account = await new goblox(); //you can fill this with your full roblosecurity cookie

    console.log(account.Username); //undefined because there no cookie parameter for "account"

    account.getAccountInfo("fastering18").then(result => {
        console.log(JSON.stringify(result));
    });
}

test()
```

object result will be: 

`
{"UserId":467971019,  
 "Username":"Fastering18",  
 "Description":"Fastering18 from yt",  
 "Status":"A back-end developer that learn something quicker."}
`  

**Functions**

`
account.getAccountInfo("fastering18") //fill it with ROBLOX username
`

First parameter is the name of ROBLOX username, if its empty, then it return current information of current 
.ROBLOSECURITY cookie



__Still on working, currently had low connection with my ISP so its still on pending update.__
