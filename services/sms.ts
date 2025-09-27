import twilio from "twilio";
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export async function sendCode(phone: string, code: string) {
  await client.messages.create({
    body: `GoalHub code: ${code}`,
    from: process.env.TWILIO_PHONE,
    to: phone
  });
}
