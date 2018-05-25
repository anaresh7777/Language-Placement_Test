
var mongoose = require('mongoose');
var validator = require('mongoose-unique-validator');
var nodemailer = require('nodemailer');


//mongoose.Promise = require('q').Promise;
mongoose.connect('mongodb://ghayyas94:12345@ds047865.mongolab.com:47865/quizapp');  //mongodb://naresh:naresh@ds249025.mlab.com:49025/languageapp
var db = mongoose.connection;
mongoose.Promise = global.Promise;

// Use bluebird
mongoose.Promise = require('bluebird');
//mongoose.Promise = require('q').Promise;
db.on('connect', function(err) {
    if (err) {
        console.log('Not connected to the database: ' + err);
    } else {
        console.log('Successfully connected to MongoDB');
    };
});

var userSchema = new mongoose.Schema({
    userName: { type: String, required: true, index: true, unique: true },
    //userMatriculation: { type: Number, required: true, index: true, unique: true },
    userEmail: { type: String, required: true, index: true, unique: true },
    userPass: { type: String, required: true },
    Date: { type: String, default: Date.now() },
    userResult: String
});
var questionSchema = new mongoose.Schema({
    question: { type: String, unique: true },
    op1: String,
    op2: String,
    op3: String,
    op4: String,
    rightAnswer: String,
    questionType: String,
    questionID: String,
    quizTopic: String,
    CreatedAt: { type: String, default: Date.now() }
});
var resultSchema = new mongoose.Schema({
    userID: String,
    userName: String,
    userMatriculation: String,
    userEmail: String,
    quizTopic: String,
    userResult: String,
    date: { type: String, default: Date.now() }
});
userSchema.plugin(validator);
var User = mongoose.model('Users', userSchema);
var Question = mongoose.model('Questions', questionSchema);
var Result = mongoose.model('Results', resultSchema);

exports.registerUser = function (req, res) {
    var userName = req.body.userName;
    //var userMatriculation = req.body.userMatriculation;
    var userEmail = req.body.userEmail;
    var userPass = req.body.userPass;
    var userInfo = new User({
        userName: userName,
       // userMatriculation: userMatriculation,
        userEmail: userEmail,
        userPass: userPass
    });
    userInfo.save(function (err, data) {
        if (err) {
            res.json({ success: false, 'message': "Cant register to this user Name", err: err });
            console.log('got Err :' + err);
        }
        else {
            console.log('Data Recieved', data);
            res.json({ success: true, "message": "Registered", 'data is': data });
        }
        console.log("data Saved");
    });
};
exports.loginUser = function (req, res) {
    //var userMatriculation = req.body.userMatriculation;
    var userName = req.body.userName;
    //let userEmail = req.body.userEmail;
    var userPass = req.body.userPass;
    User.findOne({ userName: userName, userPass: userPass }, function (err, data) {
        if (err) {
            console.log('An error has occurred');
            res.send('An error has occurred' + err);
        }
        else {
            if (!data) {
                console.log('record not found');
                res.json({ success: false, "message": "user Not Found" });
            }
            else {
                console.log("user ID is :", data._id);
                res.json({ success: true, "data": data });
                console.log("data posted " + data);
            }
        }
    });
};
exports.addQuestion = function (req, res) {
    var data = req.body;
    var question_info = new Question({
        question: data.ques,
        op1: data.op1,
        op2: data.op2,
        op3: data.op3,
        op4: data.op4,
        rightAnswer: data.rightAnswer,
        questionType: data.questionType,
        quizTopic: data.quizName
    });
    Question.findOne({ question: req.body.ques }, function (err, data) {
        if (!data) {
            console.log("data Doesnt exists..");
            res.json({ success: true, "msg": "Data Saved.." });
            question_info.save(function (err, success) {
                if (err) {
                    console.log('Error got ' + err);
                    res.json({ success: false, data: err });
                }
                else {
                    console.log("Request got " + success);
                    res.json({ success: true, data: success });
                }
            });
        }
        else {
            console.log('Data Already exists');
            res.json({ success: false, "msg": "This Question Already Exists.." });
        }
    });
};
exports.getquizes = function (req, res) {
    //let quizName = req.body.paper;
    console.log('getquizes');
    console.log(req.body.paper);
    //quizName = quizName.toLowerCase();
    //    console.log("Selected paper :",req.body.q_id1);
    Question.find({ quizTopic: req.body.paper }, function (err, data) {
        console.log('find: ' + req.body.paper);
        console.log(err);
        console.log(data);
        if (err) {
            console.log('got Error ' + err);
            res.json({ result: false, data: null });
        }
        else {
            console.log('Got Data ', data);
            res.json({ result: true, data: data });
        }
    });
    // console.log("Data come :",req.body);
};

exports.getAllquestions = function (req, res) {
    console.log('Get all the questions');
    Question.find({}, function (err, data) {
        if (err) {
            console.log('Error while fetching the questions ' + err);
            res.json({ result: false, data: null });
        }
        else {
            console.log('The Question List is ', data);
            res.json({ result: true, data: data });
        }
    });
    // console.log("Data come :",req.body);
};

exports.saveResult = function (req, res) {
    var user_result = req.body.riteans_perc;
    var userID = req.body.userID;
    var quizTopic = req.body.quizTopic;
    var userName = req.body.userName;
    var userMatriculation = req.body.userMatriculation;
    console.log(userID + "==" + user_result);
    var myDate = new Date();
    var result_info = new Result({
        userID: userID,
        quizTopic: quizTopic,
        userName: userName,
        userMatriculation: userMatriculation,
        userResult: user_result,
        date: myDate
    });
    result_info.save(function (err, data) {
        if (err) {
            console.log("Saving Result Failed.." + err);
            res.json({ success: false, data: err });
        }
        else {
            console.log("Result is Saved..", data, "quizName");
            res.json({ success: true, data: data });
        }
        console.log("Result Recived.", data);
        //res.send("Result Recived.")
    });
};
exports.showResult = function (req, res) {
    var userName = req.body.userName;
    Result.find({ userName: userName }, function (err, data) {
        if (err) {
            console.log("Got Error on Find Results");
            res.json({ success: false, data: err });
        }
        else {
            if (!data) {
                console.log("record Not found");
                res.json({ success: false, data: "Record not Found" });
            }
            else {
                res.json({ success: true, data: data });
            }
        }
    });
};

exports.userProfile = function (req, res) {
    //let UserID = req.body.UserID;
    var UserID = req.params.uid;
    console.log(UserID);
    User.findById(UserID, function (err, data) {
        if (err) {
            console.log("got error from User Profile", err);
            res.json({ success: false, "Error": err });
        }
        else {
            console.log("got Data from user Profile ", data);
            res.json({ success: true, "Data": data });
        }
    });
};


// Finding all users

exports.findAllUsers = function (req, res) {
    User.find(function (err, data) {
        if (err) {
            console.log("Users not Find.." + err);
            res.json({ success: false, "data": err });
        }
        else {
            console.log("Users Finds.. " + data);
            res.json({ success: true, "data": data });
        }
    });
};


// deleting users list
exports.deleteResult = function(req, res){
    var userID = req.body.userID;
	var userName = req.body.userName;
    console.log("The UserId is going to Delete : " + userID);
	console.log("The UserName is going to Delete : " + userName);
	
	Result.deleteOne({ userName: userName }, function(err, data){
        if (err) {
            console.log("got err", err);         
        }
        else {
            console.log("Result of User Name " + userName + "is deleted successfully");
        }
    });
	
	console.log("The UserId is going to Delete : " + userID);
    User.deleteOne({ _id: userID }, function(err, data){
        if (err) {
            console.log("got err", err);
            res.json({ success: false, data: err });
        }
        else {
            var response = {
                message: "User is successfully deleted",
                id: userID
            };
            console.log("deleted the User ", response);
            res.json({ success: true, data: response });
        }

    });
};


exports.deleteQuestion = function(req, res){
    var questionID = req.body.questionID;
    console.log("The Question is going to Delete : " + questionID);
    Question.deleteOne({ _id: questionID }, function(err, data){
        if (err) {
            console.log("got err", err);
            res.json({ success: false, data: err });
        }
        else {
            var response = {
                message: "Question is successfully deleted",
                id: questionID
            };
            console.log("deleted the Question ", response);
            res.json({ success: true, data: response });
        }

    });
};



exports.emailSend = function (req, res) {

   var data = req.body;

    var smtTransport = nodemailer.createTransport("SMTP", ({
        service: "Gmail",
        auth: {
            // enter your gmail account
            user: 'anaresh7777@gmail.com',
            // enter your gmail password
            pass: 'anaresh@542'
        }
    }));

    var mailOptions = {

        to: 'anaresh7777@gmail.com',
        subject: "Message from"  + data.senderName,
        from: data.from,
        text: data.htmlCode,
        html:  "From: " + data.senderName + "<br>" +
        "User's email: " + data.from + "<br>" +     "Message: " + data.htmlCode
    };
    console.log(mailOptions);

    smtTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        }
        else {
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
};

exports.findAllResults = function (req, res) {
    var userID = req.body.userID;
    console.log(req.body);
    Result.find({ userID: userID }, function (err, data) {
        if (err) {
            console.log("got err", err);
            res.json({ success: false, data: err });
        }
        else {
            console.log("got data admin ", data);
        }
        res.json({ success: true, data: data });
    });
};

