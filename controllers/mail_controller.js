var nodemailer = require('nodemailer');


// To send mail
module.exports.sendMail = function mail(email,password){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'reports@tendercuts.in',
            pass: 'sxwqsywkxwvjchsq',

        }
    });

    var mailOptions = {
        from: 'kmstpm@gmail.com',
        to: email,
        subject: 'Reset password from auth app',
        text: `Your password is ${password}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


}
