// var AWS = require("aws-sdk");
// AWS.config.update({
//   accessKeyId: "ASIA2BMRZOOPYMND7M53",
//   secretAccessKey: "WB8DC1rq7gRp+IuHp7rAY7BN8pfF+WN7/4EF7lqe",
//   sessionToken:
//     "FwoGZXIvYXdzENv//////////wEaDLbS/7+W/iFVsqAVOSLOAa1UiwHw4vKRcEzVaBaCSMzYEqNFTEfuxV5Cq9p7VEepMIAWweHSMSd3zbWAmimKJh4Zp5tbl5SALnXzCggzC8mRmNOJg21U2SS6kB962DWCzs0AD1Nq6+z7zmFLZH/MpZ/6MrkC3/wwZrk4BbXk9h9NuqtXln6LRsz6iBL3LK9gRp3F9O5+CyvAOHd8/fhZv3g+Gs9Xrf6xpVqwquPSCMo3gPBZU9OM7MeyqPSJaZxiWBvIma6Qv3XPam/rYgGODibOP0LvHW69K7IYSFziKKDL0/0FMi0nDsRSbBgOx7I+TPQnx1evUzuo/Lvu0x+aEnJgCoOsL2Czgn11sFRIcE/HuxY=",
//   region: "us-east-1"
// });
//
// AWS.config.region = "us-east-1"; // Région
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//   IdentityPoolId: "us-east-1:2348189f-81cd-419e-a356-03f5e4fda564"
// });
// var sqs = new AWS.SQS({ region: "us-east-1" });

import * as axios from "axios";
import { StorageHelper } from "amazon-cognito-auth-js";
import auth from "@/store/auth";

export default {
  addToSQS(email, hash) {
    var keyPrefix = "CognitoIdentityServiceProvider." + auth.auth.getClientId();
    var tokenUserName = auth.auth.signInUserSession
      .getAccessToken()
      .getUsername();
    var idTokenkey = keyPrefix + "." + tokenUserName + ".idToken";
    var storageHelper = new StorageHelper();
    var storage = storageHelper.getStorage();
    console.log(storage.getItem(idTokenkey));
    axios
      .post(
        process.env.VUE_APP_API_SQS_URL,
        {
          email: email,
          hash: hash
        },
        {
          headers: {
            Authorization: `${storage.getItem(idTokenkey)}`
          }
        }
      )
      .then(function(response) {
        console.log(response);
        return true;
      })
      .catch(function(error) {
        console.log(error);
        return false;
      });
    // var params = {
    //   MessageBody: JSON.stringify({ email: email, hash: hash }) /* required */,
    //   QueueUrl:
    //     "https://sqs.us-east-1.amazonaws.com/690184876959/CIS_queue" /* required */,
    //   DelaySeconds: "0"
    // };
    //
    // sqs.sendMessage(params, function(err, data) {
    //   if (err) {
    //     console.log(err, err.stack);
    //     return false;
    //   } // an error occurred
    //   else console.log(data); // successful response
    // });
    // return true;
  }
};
