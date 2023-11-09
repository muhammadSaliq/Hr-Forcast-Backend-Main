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
    createdOn: { type: Date, default: Date.now },
  
  });
export const departmentModel = mongoose.model('departments', departmentSchema);

const employeeSchema = new mongoose.Schema({
    emloyeename : { type: String },
    age : { type: String },
    businessTravel : { type: String },
    dailyRate: { type: String   },
    department: { type: String  },
    distanceFromHome : { type: String },
    education : { type: String },
    educationField: { type: String  },
    employeeCount : { type: String, default: "1" },
    employeeNumber: { type: String   },
    environmentSatisfaction: { type: String  },
    gender : { type: String },
    hourlyRate : { type: String },
    jobInvolvement: { type: String  },
    jobLevel : { type: String },
    jobRole: { type: String   },
    jobSatisfaction: { type: String  },
    maritalStatus : { type: String },
    monthlyIncome : { type: String },
    monthlyRate: { type: String  },
    numCompaniesWorked : { type: String },
    over18: { type: String   },
    overTime: { type: String  },
    percentSalaryHike: { type: String  },
    performanceRating : { type: String },
    relationshipSatisfaction : { type: String },
    standardHours: { type: String  },
    stockOptionLevel : { type: String },
    totalWorkingYears: { type: String   },
    trainingTimesLastYear: { type: String  },
    workLifeBalance : { type: String },
    yearsAtCompany: { type: String  },
    yearsInCurrentRole : { type: String },
    yearsSinceLastPromotion: { type: String   },
    yearsWithCurrManager: { type: String  },
    executive: { type: String , default: "1" },
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
