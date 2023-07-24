import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export default function sendTwilioMessage(number: string): void {
  client.messages
    .create({
      body: 'Hello to to softyline : Bridging the Gap between Ideas and Reality ',
      from: process.env.TWILIO_MY_TWILIO_PHONE_NUMBER,
      to: number,
    })
    .then(message => console.log(message.sid))
    .catch(error => console.error(error));
}
