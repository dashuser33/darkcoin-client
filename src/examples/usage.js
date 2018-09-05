"use strict";

var DarkcoinClient = require("../../build/darkcoin-client").default;

var config = {
  url: 'http://localhost:19998',
  user: "dashrpc",
  password: "87deb2c6a69cae93f8898e276f9ff10f"
}
var client = new DarkcoinClient(config)

/*

client.getWalletInfo().then((res) => {
    console.log("balance is " + res.result.balance);

    console.log(res)
  }).catch((e) => {
  console.log(e)
})

client.masternodeList().then((res) => {
    console.log(res.result)
})

client.gobjectList().then((res) => {
    console.log(res.result)
})

client.masternodeList().then((res) => {
    console.log(res.result)
})

client.getGovernanceInfo().then((res) => {
    console.log(res.result)
})

client.getMiningInfo().then((res) => {
    console.log(res.result)
})

client.getNetworkInfo().then((res) => {
    console.log(res.result)
})

client.gobjectCurrentVotes("e77f59d842e9c9a76c4e62e5823cdd2396cd639be9b317c20962ae627ced43f0").then((res) => {
    console.log(res.result)
})

client.getWalletInfo().then((res) => {
    console.log("balance is " + res.result.balance);

    console.log(res)
  }).catch((e) => {
  console.log(e)
})

client.sendToAddress("XbxkhvUL7KLF7633J7nySr3WFV6XnLGTf6", .0001, "", "", true, false, false).((res) =>
     console.log(res)
    }).catch((e) => {
    console.log(e)
)

*/

client.gobjectPrepare(0, 1, 1536125535, '5b5b2270726f706f73616c222c7b22656e645f65706f6368223a313533363133313635392c226e616d65223a226e657875735f746573745f31222c227061796d656e745f61646472657373223a227961597648465464434e6e575a365776564b684b646e315132796b4b465456557146222c227061796d656e745f616d6f756e74223a352c2273746172745f65706f6368223a313533363132383039342c2274797065223a312c2275726c223a2268747470733a2f2f7777772e646173686e657875732e6f7267227d5d5d').then((res) => {
  console.log(res.result);
}).catch((e) => {
  console.log(e)
})
