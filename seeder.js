const {estates,feedbacks} = require('./data');
const {Estate} = require('./modules/Estate');
const {Feedback} = require('./modules/FeedBack');
const connectOfDB = require('./config/db');


require('dotenv').config();


// Connect to DB
connectOfDB();


// Import Estates into DB

const importEstates = async () => {
    try{
        await Estate.insertMany(estates);
        console.log("Data Import Success");
    }catch(error){
        console.log("Error with data import",error);
        process.exit(1);
    }
};

// Destroy Estates Data

const deleteEstates = async () => {
    try{
        await Estate.deleteMany();
        console.log("Data Destroyed");
    }catch(error){
        console.log("Error with data destroy",error);
        process.exit(1);
    }
};

// Import Feedbacks into DB

const importFeedback = async () => {
    try{
        await Feedback.insertMany(feedbacks);
        console.log("Data Import Success");
    }catch(error){
        console.log("Error with data import",error);
        process.exit(1);
    }
};

// Destroy Feedbacks Data

const deleteFeedback = async () => {
    try{
        await Feedback.deleteMany();
        console.log("Data Destroyed");
    }catch(error){
        console.log("Error with data destroy",error);
        process.exit(1);
    }
};


if(process.argv[2] === '-delete-Estate'){
    deleteEstates();
}else if(process.argv[2] === '-import-Estate'){
    importEstates();
}else if(process.argv[2] === '-import-Feedback'){
    importFeedback();
}else if(process.argv[2] === '-delete-Feedback'){
    deleteFeedback();
}

