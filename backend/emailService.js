// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'athegreat231@gmail.com',
//     pass: 'yclpxjrgueqjvkgr'
//   }
// });

// // export const mailOptions = {
// //   from: 'youremail@gmail.com',
// //   to: 'myfriend@yahoo.com',
// //   subject: 'Sending Email using Node.js',
// //   text: 'That was easy!'
// // };

// // transporter.sendMail(mailOptions, function(error, info){
// //   if (error) {
// //     console.log(error);
// //   } else {
// //     console.log('Email sent: ' + info.response);
// //   }
// // });

// export const sendResetPasswordEmail = async (email, resetToken) => {
//   try {
//     // Send email
//     await transporter.sendMail({
//       from: "fromEmail",
//       to: email,
//       subject: 'Reset Password',
//       text: `Hello, <br> Follow this link to reset your password for your ${email} account., ${resetToken}`
//     });

//     console.log(`Reset password email sent to: ${email}`);
//   } catch (error) {
//     console.error('Error sending reset password email:', error);
//     throw new Error('Failed to send reset password email');
//   }
// };

// module.exports = { sendResetPasswordEmail, transporter };

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'athegreat231@gmail.com',
    pass: 'yclpxjrgueqjvkgr'
  }
});

const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    // Send email
    await transporter.sendMail({
      from: "fromEmail",
      to: email,
      subject: 'Reset Password',
      text: `Hello,  Follow this link to reset your password for your ${email} account., ${resetToken}`
    });

    console.log(`Reset password email sent to: ${email}`);
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw new Error('Failed to send reset password email');
  }
};

module.exports = { sendResetPasswordEmail, transporter };
