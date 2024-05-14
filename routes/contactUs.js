const express = require('express') ;
const router = express.Router();
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');



router
        .route('/')
        .get(asyncHandler(async (req,res) =>{
            res.render('contactUs');
        }))
        .post(asyncHandler(async (req,res) =>{
            const { name, email, message } = req.body;

            // Create reusable transporter object using the default SMTP transport

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.USER_PASS
                }
            });
        
            const maolOptions = {
                from : email,
                to: process.env.USER_EMAIL,
                subject: `New Message from ${name}`,
                html : `
                        <div>
                            <h4>Name: ${name}<br>Email: ${email}<br>Message: ${message}</h4>
                        </div>
                `
            }
        
            transporter.sendMail(maolOptions, (err,info) => {
                if(err) {
                            console.log(err);
                            return res.status(400).send('Error in sending email');
                        }else
                        {
                            //alert("Success");
                            //document.getElementById("success").innerHTML = "Success To Sent Message";
                            //return res.render('contactUs', { successMessage: 'Success To Sent Message' });
                            return res.status(200).send({message:'success'});
                        }
            });
            
        }));



module.exports = router;