import { Router } from "express";
import db from "../db";
import sendTextMessage from "../twilio/textMessageFunctions";
import { hasValidAdminToken, hasValidCoachToken } from "../utils/tokenCheck";

let router = Router();

// router.post(
//   "/sendTextMessage",
//   // , hasValidAdminToken
//   async (req, res) => {
//     let message = req.body.message;
//     let recipients: { phoneNumber: string; wrestlerName: string }[] =
//       req.body.recipients;

//     try {
//       for (let x = 0; x < recipients.length; x++) {
//         let wrestlerName = recipients[x].wrestlerName;
//         let phoneNumber = recipients[x].phoneNumber;
//         try {
//           sendTextMessage(message, phoneNumber);
//         } catch (error) {
//           console.log(
//             `Error seding text message to ${wrestlerName} ${phoneNumber}`
//           );
//         }
//       }
//       res.status(200).json({ message: "message succesful" });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "failed to send" });
//     }
//   }
// );

/*TODO:
    - for when we allow coaches to use this make sure admin is not same tenant
*/
router.post("/admin", hasValidAdminToken, async (req, res) => {
  let textMessage = req.body.text;
  let idsForTextMessage: { [key: number]: boolean } = req.body.idsForText;
  try {
    let arrayOfIds: number[] = [];
    let arrayOfKeyValueArrays = Object.entries(idsForTextMessage);
    for (let x = 0; x < arrayOfKeyValueArrays.length; x++) {
      if (arrayOfKeyValueArrays[x][1] === true)
        arrayOfIds.push(Number(arrayOfKeyValueArrays[x][0]));
    }
    if (arrayOfIds.length > 0) {
      let usersInfo: { phone_number: string }[] =
        await db.users.getAllUsersInArrayOfIds(arrayOfIds);
      console.log(usersInfo);
      for (let y = 0; y < usersInfo.length; y++) {
        usersInfo[y].phone_number !== null &&
          sendTextMessage(textMessage, usersInfo[y].phone_number);
      }
      res
        .status(200)
        .json({ message: "You have successfully sent your message." });
    } else {
      res.status(200).json({
        message: "You have to select wrestlers to send your message to.",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong trying to send text messages." });
  }
});

export default router;
