const nodemailer = require('nodemailer')
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';

const oauth2Client = new OAuth2(
    process.env.MAILING_SERVICE_CLIENT_ID,
    process.env.MAILING_SERVICE_CLIENT_SECRET,
    OAUTH_PLAYGROUND 
);

const sendEmail = async (options) => {
    oauth2Client.setCredentials({
        refresh_token: process.env.MAILING_SERVICE_REFRESH_TOKEN
    });

    const accessToken = oauth2Client.getAccessToken()

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: "salesberry76@gmail.com",
            clientId: process.env.MAILING_SERVICE_CLIENT_ID,
            clientSecret: process.env.MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: process.env.MAILING_SERVICE_REFRESH_TOKEN,
            accessToken
        }
    });

    const message = {
        from: options.email,
        to: "wesleySalesberry@hotmail.com", 
        subject: options.subject,
        text: `
            from ${options.email}
            name: ${options.name}
            ${options.message}
        `

    }

    const contactMessage = await transporter.sendMail(message,  (err, info) => {
        err ?  console.log(`Utils-Error: ${err}`) :  console.log(info)
    })
    //console.log('Message sent: %s', contactMessage.messageId);

}


module.exports = sendEmail;
