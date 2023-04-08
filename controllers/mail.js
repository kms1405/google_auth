var nodemailer = require('nodemailer');



module.exports.sendMail = function mail(email){

    console.log(email);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'reports@tendercuts.in',
            pass: 'sxwqsywkxwvjchsq',
            // clientId: '266606537479-a8pq7pluilh6t7tgohh6vc2hva3rmpjk.apps.googleusercontent.com',
            // clientSecret:'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'
        }
    });

    var mailOptions = {
        from: 'kmsmebe@gmail.com',
        to: 'kmstpm@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


}
