import * as dotenv from "dotenv";

dotenv.config();

export default {
  rootUrl: process.env.ROOT_URL,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  jwt: <any>{ secret: process.env.JWT_SECRET },

  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    fromEmail: process.env.MAILGUN_FROM_EMAIL,
  },
  stripe: {
    secret: process.env.STRIPE_SECRET_KEY,
    connectWebhookEndpointSecret:
      process.env.STRIPE_CONNECT_WEBHOOK_ENDPOINT_SECRECT,
  },
  twilio: {
    outGoingPhoneNumber: process.env.TWILIO_OUTGOING_PHONE_NUMBER,
    twilioAccountSID: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  },
  warZone: {
    adminUserNameOrEmail: process.env.WZ_ADMIN_USER_NAME_OR_EMAIL_ADDRESS,
    adminPassword: process.env.WZ_ADMIN_PASSWORD,
    adminRememberClient: process.env.WZ_ADMIN_REMEMBER_CLIENT,
  },
  cron: {
    createCronJobOnBuild: process.env.CREATE_CRON_JOB_ON_BUILD,
  },
};
