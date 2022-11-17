pragma solidity >=0.7.0;

contract StorePlugin {

    // plugin struct
    struct Plugin  {
        // plugin id (in contract auto-increment)
        uint256 id;
        // plugin name (unique)
        string name;
        // plugin desc 
        string desc;
        // plugin data
        string data;
        // plugin version
        string version;
        // plugin type
        string typeName;
        // plugin  is approve
        bool checked;
        // plugin owner
        address owner;
    }

    // contract owner
    address owner;

    // controllers  check the plugin
    mapping(address => bool) controller;

    // id => plugin 
    mapping(uint256 => Plugin) idToPlugin;

    // name => plugin ID。
    mapping(string => uint256) nameToId;

    // all checked plugin id
    uint256[]  ids;


    // plugin id  in contract ( auto-increment)
    uint256 pluginID;

    // init contract owner, plugin id
    constructor(uint256 id) {
        owner = msg.sender;
        pluginID = id;
    }

    // contract owner modifier
    modifier ownerOnly()  {
        require(msg.sender == owner, "Contract Error: not owner, can't operate");
        _;
    }

    // plugin check controller modifier
    modifier controllerOnly() {
        require(controller[msg.sender], "Contract Error: not controller, can't operate");
        _;
    }
    // set the check controller 
    function setController(address operater, bool isApprove)public ownerOnly{
        controller[operater] = isApprove;
    }

    // add plugin info
    function addPluginInfo(string memory name, string memory desc, string memory data, string memory typeName, string memory version) public returns (uint256) {
        require(nameToId[name] == 0, "Contract Error: this name plugin is exist");
        Plugin memory info;
        info.id = pluginID;
        info.name = name;
        info.desc = desc;
        info.data = data;
        info.version = version;
        info.typeName = typeName;
        info.checked = false;
        info.owner = msg.sender;
        idToPlugin[pluginID] = info;
        nameToId[name] = pluginID;
        pluginID ++;
        return info.id;
    }

    // check plugin 
    function checkPlugin(uint256 pluginId) public controllerOnly {
        require(idToPlugin[pluginId].checked == false, "Contract Error: this id plugin is checked!");
        // 修改审核状态
        idToPlugin[pluginId].checked = true;
        ids.push(pluginId);
    }

    // get plugin by id 
    // return pulgin id; name; desc;
    function getPluginById(uint256 pluginId) public view returns (uint256 id, string memory name, string memory desc) {
        require(idToPlugin[pluginId].checked, "Contract Error: this id plugin can't found!");
        id = pluginId;
        name = idToPlugin[pluginId].name;
        desc = idToPlugin[pluginId].desc;
    }

    // get plugin data
    function getPluginData(uint256 pluginId) public view returns (string memory data) {
        require(idToPlugin[pluginId].checked, "Contract Error: this id plugin can't found!");
        return idToPlugin[pluginId].data;
    }

    // get plugin by name
    function getPluginByName(string memory pluginName) public view returns (uint256 id, string memory name, string memory desc) {
        uint256 pluginId = nameToId[pluginName];
        require(idToPlugin[pluginId].checked, "Contract Error: this name plugin can't found");
        id = pluginId;
        name = idToPlugin[pluginId].name;
        desc = idToPlugin[pluginId].desc;
    }

    // update plugin
    function updatePlugin(uint256 pluginId, string memory desc, string memory data, string memory typeName, string memory version) public {
        require(idToPlugin[pluginId].owner == msg.sender, "Contract Error: not this plugin owner!");
        idToPlugin[pluginId].desc = desc;
        idToPlugin[pluginId].data = data;
        idToPlugin[pluginId].typeName = typeName;
        idToPlugin[pluginId].version = version;
    }

    // get all has checked ids
    function allIds() public view returns (uint256[] memory) {
        return ids;
    }
    
    // delete plugin info
    function deletePlugin(uint256 pluginId) public {
        idToPlugin[pluginId].checked = false;
        for (uint i = 0; i < ids.length; i++) {
            if (ids[i] == pluginId)  {
                ids[i] = ids[ids.length - 1];
                // Remove the last element
                ids.pop();
            }
        }
    }

}

