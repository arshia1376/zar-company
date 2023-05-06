const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const winston = require('winston');
const fs = require('fs');
const mime = require('mime');
const generateFakeUser=require('../app/http/middleware/faker');
const User=require('./models/fake')
require('dotenv').config();
const config =require("config");
const moment = require('jalali-moment');
const validator=require('express-validator')
moment().locale('fa').format('YYYY/M/D');
const app = express();
const csv = require('csvtojson');
const CsvParser = require("json2csv").Parser;
const schedule = require('node-schedule');
const path = require('path')
const mongoose = require("mongoose");
const materialsModel=require("./models/materials");
const Tutorial = materialsModel.tutorials;
const multer=require("multer")
require("express-async-errors");
const nodemailer = require("nodemailer");
const swaggerUi=require('swagger-ui-express')
require("winston-mongodb");
const Error = require("./http/middleware/Error");
const DeviceDetector = require('node-device-detector');
const api = require("./routes/api");
const http = require('http').Server(app);
const { UniqueString, UniqueNumber, UniqueStringId,UniqueNumberId,UniqueOTP,UniqueCharOTP } = require('unique-string-generator');
const io = require('socket.io')(http);
const swaggerDocument = require('./swagger.json');
const helmet = require("helmet");
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const colors = require('colors');
const uploads=multer({dest:'uploads/'})
const session = require('express-session');
const passport = require("passport");
const {date} = require("joi");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
app.set(validator)
const GOOGLE_CLIENT_ID = '905389007993-g6i47uhuc6grubd74nehoht9l7k58mag.apps.googleusercontent.com'; //Client ID const
const GOOGLE_CLIENT_SECRET = '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'; //Client secret
app.set('view engine', 'ejs');


class Application {
    constructor() {
        this.setupExpressServer();
        this.setupMongoose();
        this.setupEmail()
        this.setupRoutesAndMiddleware();
        this.setupConfigs();
        this.setupAuthGoogle();
        this.setupSocketIo();
        this.setupCsv();
        this.setupDeviceDetector();
        this.setupJalaliMoment();
        this.setupDownload();
        this.setupFake();

    }


   setupDeviceDetector(){
       const detector = new DeviceDetector({
           clientIndexes: true,
           deviceIndexes: true,
           deviceAliasCode: false,
       });
       const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
       const result = detector.detect(userAgent);
       // console.log('result parse', result);
   }

    setupExpressServer() {
        const port = process.env.myPort || 4343;
        http.listen(port, (err) => {
            if (err) console.log(err);
            else console.log("app listen to port : ".blue+port);
        })

    }

    setupDownload(){
        app.get('/download', (req, res) => {
            const filePath = '/Users/arshia/Desktop/arshia/food.api/node-zar/uploads/1680963446743-csvFile.csv'; // Replace with the actual file path

            // Check if the file exists
            if (fs.existsSync(filePath)) {
                // Set the appropriate headers for the response
                res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filePath)}`);
                res.setHeader('Content-Type', 'application/octet-stream');

                // Create a readable stream to the file and pipe it to the response
                const fileStream = fs.createReadStream(filePath);
                fileStream.pipe(res);
            } else {
                res.status(404).send('File not found');
            }
        });
    }

    setupSocketIo(){

        app.get('/socketChat', (req, res) => {
            res.sendFile( __dirname +'/views/pages/auth/chat.html');

        });

        io.on('connection', (socket) => {
            socket.on('chat message', msg => {
                io.emit('chat message', msg);
            });
        });

    }

    setupCsv(){
        app.use(express.static("uploads"));
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {cb(null, 'uploads/')},
            filename: function (req, file, cb) {cb(null,Date.now()+ '-'+file.originalname)}
        })
        var uploads = multer({ storage: storage })

        app.get('/csv', (req, res) => {
            materialsModel.find((err, data) => {
                if (err) {
                } else {
                    if (data != '') {
                        res.render('../app/views/pages/auth/csv', { data: data })
                    } else {
                        res.render('../app/views/pages/auth/csv', { data: '' })
                    }
                }
            })
        })

        var empResponse
        app.post('/csv', uploads.single('csvFile'), (req, res) => {
            csv()
                .fromFile(req.file.path)
                .then((response) => {
                    for (var x = 0; x < response; x++) {
                        empResponse = parseFloat(response[x].name)
                        response[x].name = empResponse
                    }
                    materialsModel.insertMany(response, (err, data) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.redirect('/csv')
                        }
                    })
                })
        })
    }

    setupJalaliMoment(){
        var A = new Date();
       var date= moment(A, 'YYYY-M-D')
            .locale('fa')
            .format('YYYY/M/D');
        console.log("today's date : "+date)
    }

    setupEmail(){

        const smtpTransport = nodemailer.createTransport({

            service: "gmail",

            host: "smtp.gmail.com",

            auth: {

                user: "msafikhani1717@gmail.com",

                pass: "vdfdinifkhlqtycx"

            }

        });



        app.get('/email', function(req, res)  {
            res.render('../app/views/pages/auth/email');
        });

        app.get('/send',function(req,res){

            var mailOptions={

                to : req.query.to,

                subject : req.query.subject,

                text : req.query.text

            }

            console.log(mailOptions);

            smtpTransport.sendMail(mailOptions, function(error, response){

                if(error){

                    console.log(error);

                    res.end("error");

                }else{

                    console.log("Message sent: " + response.message);

                    res.send("sent");

                }

            });

        });

    }


    setupFake(){
        app.get('/importUsers', async (req, res) => {
            try {
                const fakeUsers = Array.from({ length: 30 }, generateFakeUser);

                await User.create(fakeUsers);
                res.send('Fake users imported successfully!');
            } catch (error) {
                console.error('Error importing users:', error);
                res.status(500).send('An error occurred during user import.');
            }
        });
    }

    setupMongoose() {
        mongoose.set('strictQuery', true);
        const job = schedule.scheduleJob('*/9 * * * *', function(){
            console.log('run'.blue);
        });
        const mongodbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        mongoose.connect('mongodb://127.0.0.1:27017/zar', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log("db connected".green);
        }).catch(err => {
            console.log("db not connected".red, err);
        })
    }

    setupAuthGoogle(){
        app.use(session({
            resave: false,
            saveUninitialized: true,
            secret: 'SECRET'
        }));

        app.get('/google_login', function(req, res)  {
            res.render('../app/views/pages/auth/login');
        });



        var userProfile;
        app.use(helmet());
        app.use(passport.initialize());
        app.use(passport.session());

        app.get('/success', (req, res) => {
            res.render("../app/views/pages/auth/success",{user:userProfile})
        });
        app.get('/error', (req, res) => res.send("error logging in"));

        passport.serializeUser(function (user, cb) {
            cb(null, user);
        });

        passport.deserializeUser(function (obj, cb) {
            cb(null, obj);
        });

        // app.js

        /*  Google AUTH  */

        passport.use(new GoogleStrategy({
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:8080/auth/google/callback"
            },
            function(accessToken, refreshToken, profile, done) {
                userProfile=profile;
                return done(null, userProfile);
            }
        ));

        app.get('/auth/google',
            passport.authenticate('google', { scope : ['profile', 'email'] }));

        app.get('/auth/google/callback',
            passport.authenticate('google', { failureRedirect: '/error' }),
            function(req, res) {
                // Successful authentication, redirect success.
                res.redirect('/success');
            });
    }

    setupRoutesAndMiddleware() {
        app.use(express.json());
        //data teq url
        app.use(express.urlencoded({extended: true}))
        //download img and text and...
        app.use(express.static("uploads"))
        //format log debug
        if (app.get("env") === "development") {
            app.use(morgan("tiny"));
        }

        //secret
        app.use(helmet());

        //secret req port
        app.use(cors())
        app.use(Error)
        app.use(morgan('combined'));
        //routes
        app.use("/api", api)
    }

    setupConfigs() {

        console.log(config.get("databaseAddress").yellow);
        winston.add(new winston.transports.File({filename: 'Error-log.log'}));
        winston.add(new winston.transports.MongoDB({
            db: "mongodb://127.0.0.1:27017/zar",
            level: "error"
        }));
    }
}

//template html pug
/*app.set("view engine", "pug")
app.set("views", "../views") //default*/

module.exports = Application;




