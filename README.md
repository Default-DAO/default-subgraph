Quick dirty steps to get it running locally. 

This subgraph was created using this guide with some minor tweaks https://thegraph.com/docs/developer/quick-start

Here's the high level steps to get it deployed locally:
- deploy Default contracts to a local ganache network
- clone this project: https://github.com/graphprotocol/graph-node
  - I had to make a minor adjustment to the docker-compose.yml file to get it running. I added the file to the graph-node-docker-file directory. so copy this file and overwrite graph-node/docker/docker-compose.yml.
  - then after you copy over the docker-compose.yml file enter the ```graph-node/docker``` project directory and run:
    ```
    docker-compose up
    ```
  - your local graph node should be running now
- finally run this in the default-subgraph project directory to create graphql generated code and deploy to your local graph node:
```
yarn && yarn codegen
yarn create-local
yarn deploy-local
```
This should deploy the subgraph to your local graph node which is listening to your local ganache network.
