// import nodemailer from 'nodemailer';
// import path from 'path';
// import fs from 'fs';
// import { generateToken } from './jwtUtils';

// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: process.env.GMAIL_EMAIL,
//     pass: process.env.GMAIL_PASS,
//   },
// });

// export const sendResetPassowrdEmail = async ({
//   email,
//   name,
//   id,
// }: {
//   id: string;
//   name: string;
//   email: string;
// }) => {
//   const payload: {
//     id: string;
//     email: string;
//     exp: number; // Set token expiration time to 1 hour
//   } = {
//     id,
//     email,
//     exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
//   };

//   const verificationToken = generateToken(payload);

//   const templatePath = path.join(process.cwd(), 'emails', 'ResetPassword.html');

//   const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

//   var message = htmlTemplate
//     .replace('{{User_Name}}', name)
//     .replace(
//       '{{password_reset_url}}',
//       `${process.env.BASEURL}/reset?token=${verificationToken}`
//     )
//     .replace(
//       'href="url"',
//       `href="${process.env.BASEURL}/reset?token=${verificationToken}"`
//     )
//     .replace(
//       'href="reset"',
//       `href="${process.env.BASEURL}/reset?token=${verificationToken}"`
//     );

//   const mailOptions = {
//     from: 'CoStudy',
//     to: email,
//     subject: 'Reset your password',
//     html: message,
//   };

//   return await transporter.sendMail(mailOptions);
// };
