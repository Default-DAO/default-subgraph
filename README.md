## Running this project locally

- start a local hardhat network (hostname must be 0.0.0.0):
  ```
  npx hardhat node --hostname 0.0.0.0
  ```
- deploy Default contracts to local network from the default-core project
  ```
  npx hardhat run scripts/init.js --network dev
  ```
  - once the contracts have been deployed copy the DefaultOSFactory address and overwrite the DefaultOSFactory address in default-subgraph/subgraph.yml. Unfortunately, this needs to be done on every contract deployment or anytime you reset the local network.
- start up a local graph node by entering the graph-node-docker-file project directory and running:
    ```
    sh start.sh
    ```
- fianlly run this in the default-subgraph project directory to create graphql generated code and deploy to your local graph node:
  ```
  yarn && yarn codegen
  yarn create-local
  yarn deploy-local
  ```
This should deploy the subgraph to your local graph node which is listening to your local network.

### Generating contract data 
At the moment there is no seed data script. You can generate data by interacting with the contracts through node shell. 

Here's an example script you can run which will generate a new OS:
```
let factoryAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3' 
let myAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
let Web3 = require('web3');
let { ethers } = require("hardhat");

let factoryAbi = require('./artifacts/contracts/os/DefaultOSFactory.sol/DefaultOSFactory.json').abi;
let osAbi = require('./artifacts/contracts/os/DefaultOS.sol/DefaultOS.json').abi;
let web3 = new Web3('http://localhost:8545');
let accounts = await web3.eth.getAccounts();
accounts
let factory = new web3.eth.Contract(factoryAbi, factoryAddress);
await factory.methods.setOS(ethers.utils.formatBytes32String('testOS')).send({from: myAddress});
```



Make sure you run node shell within the default-core project and with the experimental-repl-await flag to use async code. 
```
node --experimental-repl-await
```

