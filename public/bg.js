chrome.runtime.onMessage.addListener((res) => {
  console.log(res);
  let data = JSON.parse(res);
  if (
    !localStorage.getItem("acc") &&
    (data.message === "OpenNFT_transfer" || data.message === "OpenNFT_demand")
  ) {
    //判断是否登录
    chrome.windows.create({
      url: `../index.html#/Login?detail=${res}`,
      type: "popup",
      width: 460,
      height: 700,
    });
  } else {
    if (data.message == "OpenNFT_transfer") {
      //转移资产页面
      //打开其他页面配置
      chrome.windows.create({
        url: `../index.html#/Details?index=转移资产&&detail=${res}`,
        type: "popup",
        width: 460,
        height: 700,
        top: 80,
      });
    } else if (data.message == "OpenNFT_demand") {
      //查询NFT余额
      chrome.windows.create({
        url: `../index.html#/Details?index=查询NFT余额&&detail=${res}`,
        type: "popup",
        width: 460,
        height: 700,
        top: 80,
      });
    }
  }
});
// chrome.runtime.onMessageExternal.addListener(function (
//   request,
//   sender,
//   sendResponse
// ) {
//   if (request) {
//     if (request.message) {
//       if (request.message == "is_install") {
//         sendResponse({ is_install: true });
//       }
//     }
//   }
//   return true;
// });
