var nodemailer = require('nodemailer');



module.exports.sendMail = function mail(email,password){

    console.log(email);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'reports@tendercuts.in',
            pass: 'sxwqsywkxwvjchsq',

        }
    });

    var mailOptions = {
        from: 'kmsmebe@gmail.com',
        to: 'kmstpm@gmail.com',
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
