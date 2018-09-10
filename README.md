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

## FAQ

### Why build this?

We don't necessarily need to have a single API/library. Different devs prioritize different things. This library focuses on correctness enforcing thru type safety provided by Typescript, with explicit functions rather a thin proxy over the RPC api.

### Why this name?

There was already dashd-client and dash-client. We might change it if enough people think it should.

### Why the method I am looking for is not present?

This is a working in progress, we will add them as we have time and/or need. But we are not adding deprecated methods, such as accounts api. Any method can still be accessed using the generic `callRPCMethod` function.

### Can I use this in a production environment?

It is still an experimental/working in progress thing, but the alternative libraries seems to also be, so, I guess this can be used, too. We have been testing methods as we add them but we advise to test this library well before using in a production environment.

## Credits

- Dash/Bitcoin RPC api devs
- Dash Developer Reference at https://dash-docs.github.io/en/developer-reference
- Typescript starter at https://github.com/bitjson/typescript-starter

