import XuperSDK, { Endorsement } from "@xuperchain/xuper-sdk";
const node = "https://xuper.baidu.com/nodeapi";
const chain = "xuper";
const params = {
  server: "https://xuper.baidu.com/nodeapi", // ip, port
  fee: "400", // fee
  endorseServiceCheckAddr: "jknGxa6eyum1JrATWvSJKW3thJ9GKHA9n", // sign address
  endorseServiceFeeAddr: "aB2hpHnTBDxko3UoP2BpBZRujwhdcAFoT", // fee address
};
export const xsdk = new XuperSDK({
  node,
  chain,
  plugins:
    localStorage.getItem("nodeApi") === "https://xuper.baidu.com/nodeapi"
      ? [
          Endorsement({
            transfer: params,
            makeTransaction: params,
          }),
        ]
      : null,
});
