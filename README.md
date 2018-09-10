# darkcoin-client

Dash RPC api client. See docs at https://dashuser33.github.io/darkcoin-client/


Example javascript usage:

```javascript
"use strict";

var DarkcoinClient = require("darkcoin-client").default;

var config = {
  url: 'http://localhost:19998',
  user: "dashrpc",
  password: "87deb2c6a69cae93f8898e276f9ff10f"
}
var client = new DarkcoinClient(config)
client.getWalletInfo().then((res) => {
    console.log("balance is " + res.result.balance);

    console.log(res)
  }).catch((e) => {
  console.log(e)
})

```

A more complete example in Typescript can be found at https://github.com/dashuser33/darkcoin-client-sample

