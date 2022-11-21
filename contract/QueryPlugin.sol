pragma solidity >=0.7.0;

import "./StorePlugin.sol";

/**
    query plugin info contract
 */
contract QueryPlugin {
    StorePlugin store;

    // init 
    constructor(StorePlugin addr){
        store = addr;
    }

    // get all checked plugins
    function allIds() public view returns (uint256[] memory) {
        return store.allIds();
    }

    // get plugin inf byID
    function getPluginById(uint256 pluginId) public view returns (uint256 id, string memory name, string memory desc) {
       return store.getPluginById(pluginId);
    }

    // get plugin data
    function getPluginData(uint256 pluginId) public view returns (string memory data) {
          return store.getPluginData(pluginId);
    }

}