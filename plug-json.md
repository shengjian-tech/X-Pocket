```json
{
  "netList": [
    // 网络合集    默认开放网络则不填
    {
      "netName": "开放网络",
      "node": "https://xuper.baidu.com/nodeapi",
      "chain": "xuper"
    }
  ],
  "plug": [
    // 插件所属和插件名称
    {
      "company": "盛见",
      "plugName": "openNft"
    }
  ],
  "tabCont": [[], [], [], [], []], //  界面 五块功能，暂时未定，暂时不填
  "addList": [
    //  首页插件 操作 方法，与参数
    {
      "name": "转移资产", //操作名称
      "contractName": "opennft", // 合约名
      "methodName": "safeTransferFrom", // 方法名
      "formValue": [
        // 参数
        { "value": "address", "label": "接受者账户" },
        { "value": "token_id", "label": "资产ID" },
        { "value": "num", "label": "数量" }
      ],
      "type": "transaction"
    },
    {
      "name": "查询NFT余额",
      "contractName": "opennft",
      "type": "query",
      "methodName": "balanceOf",
      "formValue": [{ "value": "token_id", "label": "资产ID" }]
    },
    {
      "name": "查询交易",
      "contractName": "opennft",
      "type": "query",
      "methodName": "getTokenBytes",
      "formValue": [{ "value": "txId", "label": "交易ID" }]
    }
  ]
}
```
