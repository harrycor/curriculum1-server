import config from "../config";
const twilioAccountSid = config.twilio.twilioAccountSID;
const twilioAuthToken = config.twilio.twilioAuthToken;
const twilioFromPhoneNumber = config.twilio.outGoingPhoneNumber;

const client = require("twilio")(twilioAccountSid, twilioAuthToken);

let sendTextMessage = (
  outGoingMessage: string,
  outGoingPhoneNumber: string,
  count: number = 1,
  wrestlerName: string | null = null
) => {
  client.messages
    .create({
      body: outGoingMessage,
      from: twilioFromPhoneNumber,
      to: `1${outGoingPhoneNumber}`,
    })
    .then((message: any) => {
      // console.log(message);
      return;
      // return message;
    })
    .catch((err: any) => {
      console.log(
        `Error sending text message to ${wrestlerName}-${outGoingPhoneNumber}`
      );
      console.log(err);

      if (count <= 32) {
        //ask john
        // if (err.code === 20429) {
        if (err) {
          setTimeout(() => {
            sendTextMessage(outGoingMessage, outGoingPhoneNumber, count * 2);
            console.log({
              msg: `sending it again for ${outGoingPhoneNumber}`,
            });
            console.log({ theCount: count });
            // Math.random just makes sure that a batch of requests don't keep retrying at the same time.
          }, 1000 + 1000 * count + Math.random() * 10);
        }
      } else {
        console.log(
          `Message never went through, count was higher than 32. Count: ${count}`
        );
      }
      return;
      // return err;
    });
};
export default sendTextMessage;

// sendTextMessage("hey scrub", 5169969922, "Error!");
