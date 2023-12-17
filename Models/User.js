import mongoose from 'mongoose';
const mongodbURI = process.env.mongodbURI || "mongodb://salikrafiq11111:finalyearkiet@ac-lrx664k-shard-00-00.j6i4uef.mongodb.net:27017,ac-lrx664k-shard-00-01.j6i4uef.mongodb.net:27017,ac-lrx664k-shard-00-02.j6i4uef.mongodb.net:27017/?ssl=true&replicaSet=atlas-zahecd-shard-0&authSource=admin&retryWrites=true&w=majority";
/////////////////////////////////////////////////////////////////////////////////////////////////

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  createdOn: { type: Date, default: Date.now },

});

const departmentSchema = new mongoose.Schema({
    departmentname: String,
    contact: String,
    departmentmanager: String,
    description: String,
    executive: { type: String , default: "1" },
    createdOn: { type: Date, default: Date.now },
  
  });
export const departmentModel = mongoose.model('departments', departmentSchema);

const employeeSchema = new mongoose.Schema({
    emloyeename : { type: String },
    Age : { type: String },
    BusinessTravel : { type: String },
    DailyRate : { type: Number   },
    Department : { type: String  },
    DistanceFromHome : { type: Number },
    Education : { type: Number },
    EducationField : { type: String  },
    EmployeeCount : { type: String, default: "1" },
    EmployeeNumber : { type: String   },
    EnvironmentSatisfaction : { type: Number  },
    Gender : { type: String },
    HourlyRate : { type: Number },
    JobInvolvement : { type: Number  },
    JobLevel : { type: Number },
    JobRole : { type: String   },
    JobSatisfaction : { type: Number  },
    MaritalStatus : { type: String },
    MonthlyIncome : { type: Number },
    MonthlyRate : { type: Number  },
    NumCompaniesWorked : { type: Number },
    Over18 : { type: String   },
    OverTime : { type: String  },
    PercentSalaryHike : { type: Number  },
    PerformanceRating : { type: Number },
    RelationshipSatisfaction : { type: Number },
    StandardHours : { type: String  },
    StockOptionLevel : { type: Number },
    TotalWorkingYears: { type: Number   },
    TrainingTimesLastYear : { type: Number  },
    WorkLifeBalance : { type: Number },
    YearsAtCompany : { type: Number  },
    YearsInCurrentRole : { type: Number },
    YearsSinceLastPromotion : { type: Number   },
    YearsWithCurrManager : { type: Number  },

        vacationleave: { type: String , default: "0" },
    sickleave: { type: String , default: "0" },
    personalleave: { type: String , default: "0" },
    latearrivals: { type: String , default: "0" },
    lateleaving: { type: String , default: "0" },

    executive: { type: String , default: "1" },
    CreatedbyUser: { type: String   },
    UpdatedbyUser: { type: String   },
    updatedtime: { type: String   },
        createdOn: { type: Date, default: Date.now },
});
export const employeeModel = mongoose.model('EmployeeAll', employeeSchema);



const User = mongoose.model('User', userSchema);
mongoose.connect(mongodbURI);
////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////

export default User;
