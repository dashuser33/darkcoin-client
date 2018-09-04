"use strict";

var DarkcoinClient = require("../../build/darkcoin-client").default;

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

