//Messaging Helper Functions

const nodemailer = require('nodemailer');
const apiHTTPS = require('https');
const apiHTTP = require('http');

module.exports = function(server, restify) {
  server.sendOTP = function(userTo, callback) {
    OTP_NO = 0;
    while(OTP_NO<1000) {
      OTP_NO = Math.ceil(Math.random()*10000);
    }
    
    dated = new Date();
    expires = moment().add(15, 'mm').format('YYYY-MM-DD');
    server.mysql.query("DELETE FROM log_otp WHERE mobile=? OR created_on < date(now())",[userTo], function(err, results, fields) {
//       console.log(err);
      server.mysql.query(
          "INSERT INTO log_otp"+
          "(mobile,otp,expires_on,created_on) VALUES"+
          "(?,?,?,?)",
          [userTo,OTP_NO,expires,dated],function(err, results, fields) {
          if(err) {
            return callback(false,"OTP Generation Errror");
          }

          //server.sendEmail(userTo,"OTP MAIL","Your Login/Registeration OTP : "+OTP_NO+" \n<br>For : "+userTo);
          server.sendSMS(userTo, "OTP for you is "+OTP_NO);
            
          return callback(true);
        });
    });
  },
    
  server.sendSMS = function(smsTO, msgBody, msgType, params) {
    
  },
    
  server.sendEmail = function(toEmail, subject, msgBody) {
    var transporter = nodemailer.createTransport(server.config.mail);
    var mailOptions = {
        from: '"Test NoReply" <noreply@test.com>', // sender address
        to: toEmail, // list of receivers
        subject: subject, // Subject line
        text: msgBody.replace('<br>','\n').replace("<hr>","\n\n").replace(/<(?:.|\n)*?>/gm, ''), // plain text body
        html: msgBody // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  }
  
  return this;
}