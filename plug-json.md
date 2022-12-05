```json
{
  "addList": [
    // 功能操作合集
    {
      "name": "转移资产", //操作名称
      "icon": "el-icon-sort", // 操作icon，图标地址:https://element.eleme.io/#/zh-CN/component/icon
      "type": "transaction", // 操作类型，query查询，transaction交易转移等
      "formValue": [
        //操作参数
        {
          "label": "来源账户Address",
          "value": "from"
        },
        {
          "label": "接受者账户Address",
          "value": "to"
        },
        {
          "label": "资产ID",
          "value": "id"
        },
        {
          "label": "编号",
          "value": "sonId"
        },
        {
          "label": "数量",
          "value": "amount"
        },
        {
          "label": "额外数据",
          "value": "data"
        }
      ],
      "methodName": "safeTransfer", //操作方法，合约方法。针对xuper
      "contractName": "makerone", //合约名
      "txType": "1", //是否需要调用合约方法，1，需要，0 不需要 只需要调用固有api
      "search": "transaction" //api取值参数，解析xuper 中 xsdk.queryTransaction的结果内容。
    },
    {
      "name": "查询NFT余额",
      "icon": "el-icon-search",
      "type": "query",
      "formValue": [
        {
          "label": "资产ID",
          "value": "id"
        },
        {
          "label": "资产编号",
          "value": "sonId"
        },
        {
          "label": "查询账户",
          "value": "from"
        }
      ],
      "methodName": "getTokenBalance",
      "contractName": "makerone",
      "txType": "1",
      "search": "responses"
    },
    {
      "name": "查询交易",
      "icon": "el-icon-search",
      "type": "query",
      "formValue": [
        {
          "label": "交易ID",
          "value": "txId"
        }
      ],
      "methodName": "getTokenBytes",
      "contractName": "opennft",
      "txType": "0",
      "txName": "queryTransaction",
      "search": "tx"
    }
  ],
  "type": "xuper", //插件类型 xuper属于开放网络，eth属于以太坊网络
  "tabCont": [
    //首页五大模块，内容。
    [
      //nfts,
      {
        "nftsname": "MakerONE", //nfts 名称，
        "nftsurl": "https://testmakerone.shengjian.net/qianbao/api/qianbao/xuperChain/userAsserts", //请求地址，xuper是本地服务，eth是nftscan的请求连接。eg:https://restapi.nftscan.com/api/v2/account/own/0xca1257ade6f4fa6c6834fdc42e030be6c0f5a813?erc_type=erc721
        "xapikey": "PbTZQvKNwCJWA2nAuQyFELrS", //nftscan 请求头的header X-API-KEY 字段。
        "contract_address": "makerone" //资产的 NFT 合约地址
      }
    ],
    [],
    [],
    [],
    []
  ]
}
```
