## Running this project locally

- graph-node needs to be version 0.24.1
- graph-cli needs to be version 0.22.1

- installing graph-cli:
  ```
  yarn global add @graphprotocol/graph-cli
  ```

- start a local hardhat network (hostname must be 0.0.0.0):
  ```
  npx hardhat node --hostname 0.0.0.0
  ```
- deploy Default contracts to local network from the default-core project along with seed data
  ```
  npx hardhat run scripts/seedData.js --network dev
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
From the default-core project spin up a local hardhat node:
```
npx hardhat node --hostname 0.0.0.0
```

then run the seed data script
```
npx hardhat run scripts/seedData.js --network dev
```

### Testing using matchstick
- Must export the test functions in the mappings file when running the tests. These exports must be commented out during production.

Run the tests with this command:
```
yarn test
```

- Helpful docs:
https://github.com/LimeChain/matchstick

https://github.com/LimeChain/demo-subgraph

https://limechain.tech/blog/matchstick-what-it-is-and-how-to-use-it/

