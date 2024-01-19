import express from "express";
import User from "./Models/User.js"; // Adjust the path based on your directory structure
import bcrypt from "bcrypt";
import crypto from "crypto"; // Import the 'crypto' module
import jwt from "jsonwebtoken"; // Import the jsonwebtoken library
import nodemailer from "nodemailer";
const app = express();
const port = process.env.PORT || 8000; // Use process.env.PORT for flexibility
import cors from "cors";
const SECRET = process.env.SECRET || "topsecret";
import cookieParser from "cookie-parser";
import multer from "multer";
import bucket from "./Bucket/Firebase.js";
import fs from "fs";
import path from "path";
import { employeeModel } from "./Models/User.js";
import { departmentModel } from "./Models/User.js";

import { PythonShell } from "python-shell";

app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:3000", "*"],
    credentials: true,
  })
);
const storage = multer.diskStorage({
  destination: "/tmp",
  filename: function (req, file, cb) {
    console.log("mul-file: ", file);
    cb(null, `${new Date().getTime()}-${file.originalname}`);
  },
});
const upload = multer({ storage });
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Final Year Project ");
});

//users
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user with the given email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    let body = req.body;
    body.email = body.email.toLowerCase();

    if (!body.email || !body.password) {
      res.status(400).send(`required fields missing, request example: ...`);
      return;
    }

    // check if user exists
    const data = await User.findOne(
      { email: body.email },
      "username email password"
    );

    if (data && body.password === data.password) {
      // user found
      console.log("User Successfully Logged In !");
      console.log("data: ", data);

      const token = jwt.sign(
        {
          _id: data._id,
          email: data.email,
          iat: Math.floor(Date.now() / 1000) - 30,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        },
        SECRET
      );

      console.log("token: ", token);

      res.cookie("Token", token, {
        maxAge: 86_400_000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.send({
        message: "login successful",
        profile: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          age: data.age,
          _id: data._id,
        },
      });

      return;
    } else {
      // user not found
      console.log("user not found");
      res.status(401).send({ message: "Incorrect email or password" });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({ message: "login failed, please try later" });
  }
});



//add emloyee

app.post("/addemployee", async (req, res) => {
  try {
    const { emloyeename, Age, BusinessTravel,DailyRate,Department , DistanceFromHome, Education,EducationField,
      EmployeeNumber, EnvironmentSatisfaction,Gender,HourlyRate,JobInvolvement, JobLevel,JobRole,JobSatisfaction,MaritalStatus,
      MonthlyIncome,MonthlyRate,NumCompaniesWorked,Over18, OverTime, PercentSalaryHike, PerformanceRating,RelationshipSatisfaction,StandardHours,
      StockOptionLevel, TotalWorkingYears,TrainingTimesLastYear, WorkLifeBalance,YearsAtCompany,YearsInCurrentRole,YearsSinceLastPromotion,
      YearsWithCurrManager, CreatedbyUser
    } = req.body;

 
    // Create a new user
    const newEmployee = new employeeModel({
      emloyeename,
      Age,
      BusinessTravel,
      DailyRate,
      Department,
      DistanceFromHome,
      Education,
      EducationField,
      
      EmployeeNumber,
      EnvironmentSatisfaction,
      Gender,
      HourlyRate,
      JobInvolvement,
      JobLevel, 
      JobRole,
      JobSatisfaction,
      MaritalStatus,
      MonthlyIncome,
      MonthlyRate,
      NumCompaniesWorked,
      Over18,
      OverTime,
      PercentSalaryHike,
      PerformanceRating,
      RelationshipSatisfaction,
      StandardHours,
      StockOptionLevel,
      TotalWorkingYears,
      TrainingTimesLastYear,
      WorkLifeBalance,
      YearsAtCompany,
      YearsInCurrentRole,
      YearsSinceLastPromotion,
      YearsWithCurrManager,
      CreatedbyUser
    });

    // Save the user to the database
    await newEmployee.save();

    res.status(201).json({ message: "Employee registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/allemployees", async (req, res) => {
  try {
    const result = await employeeModel.find({ executive: "1" }).exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all employee successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });

  }
});
app.get("/allemployeesbench", async (req, res) => {
  try {
    const result = await employeeModel.find({ executive: "0" }).exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all employee successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });

  }
});
  app.get("/geteditemployee/:id", async (req,res) => {     

    const EmpId = req.params.id;
    const Employee = await employeeModel.findOne({_id:EmpId});
  
    res.send({message: "customer found", Product : Employee})
  });
app.put("/editemployee/:id", async (req,res) => {

  const employeeId = req.params.id;
  const updatedEmloyeeData = req.body;
  const UpdatedbyUser = req.body.UpdatedbyUser
console.log("empid",employeeId)
console.log("dta",updatedEmloyeeData)
console.log("upsr",UpdatedbyUser)

  try{
  const employeeData = await employeeModel.findByIdAndUpdate(employeeId, updatedEmloyeeData, {
    new: true, // Return the updated employeeData
  });
  if (!employeeData) {
    return res.status(404).json({ message: 'employee Data not found' });
  }

  res.json(product);
}
catch {
  res.status(500).json({ message: 'Server Error' });
}


});

app.get("/deleteemployee/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const FindData = await employeeModel.findById({ _id: id });

    if (FindData) {
     // FindData.isApproved = true;
   await FindData.updateOne({ executive: "0" });
      res.send({
        message: "Employee deleted successfully",
        data : FindData,
      });
    } else {
      res.status(404).send({
        message: "No Employee found with this id: " + id,
      });
    }
    console.log("data",FindData);
    console.log("id",id);
  } catch (err) {
    res.status(500).send({
      message: "Server error",
    });
  }

});

//department
app.post("/adddepartments", async (req, res) => {

  try {
    const { departmentname, contact, departmentmanager, description  } = req.body;
    const existingUser = await departmentModel.findOne({ departmentname });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
 
    const newDepartment = new departmentModel({
      departmentname,
      contact,
      departmentmanager,
      description
      
    });

    await newDepartment.save();

    res.status(201).json({ message: "Department Added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/alldepartments", async (req, res) => {
  try {
    const result = await departmentModel.find().exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all department successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});
app.get("/geteditdepaprtment/:id", async (req,res) => {     

  const DepId = req.params.id;
  const department = await departmentModel.findOne({_id:DepId});

  res.send({message: "customer found", Product : department})
});
app.put("/editdepartment/:id/:name/:old", async (req,res) => {

  const depId = req.params.id;
  const depname = req.params.name;
  const depoldname = req.params.old;

  const updatedDepartmentData = req.body;
  console.log("deps", updatedDepartmentData.departmentname)
  console.log("depnames", depname)

  try{
    const result = await employeeModel.find({Department : depname}).exec();
  const departmentData = await departmentModel.findByIdAndUpdate(depId, updatedDepartmentData, {
    new: true, // Return the updated departmentData
  });
  await employeeModel.updateMany(
    { Department: depoldname },
    { $set: { Department: depname } }
  );
  if (!departmentData) {
    return res.status(404).json({ message: 'department Data not found' });
  }

  res.json(departmentData);
}
catch {
  res.status(500).json({ message: 'Server Error' });
}


});
app.get("/deletedepartment/:id/:name", async (req, res) => {
  const id = req.params.id;
  const name = req.params.name;
console.log("dep", name)
  try {
    const FindData = await departmentModel.findById({ _id: id });
    const result = await employeeModel.find({Department : name}).exec();
    console.log("res", result)

    if (FindData) {
     // FindData.isApproved = true;
   await FindData.updateOne({ executive: "0" });
   await employeeModel.updateMany(
    { Department: name },
    { $set: { executive: "0" } }
  );

      res.send({
        message: "Department deleted successfully",
        data : FindData,
        res: result
      });
    } else {
      res.status(404).send({
        message: "No Department found with this id: " + id,
      });
    }
    console.log("data",FindData);
    console.log("id",id);
  } catch (err) {
    res.status(500).send({
      message: "Server error",
    });
  }

});
app.get("/activedepartment/:id/:name", async (req, res) => {
  const id = req.params.id;
  const name = req.params.name;

  try {
    const FindData = await departmentModel.findById({ _id: id });

    if (FindData) {
     // FindData.isApproved = true;
   await FindData.updateOne({ executive: "1" });
   await employeeModel.updateMany(
    { Department: name },
    { $set: { executive: "1" } }
  );
      res.send({
        message: "Department deleted successfully",
        data : FindData,
      });
    } else {
      res.status(404).send({
        message: "No Department found with this id: " + id,
      });
    }
    console.log("data",FindData);
    console.log("id",id);
  } catch (err) {
    res.status(500).send({
      message: "Server error",
    });
  }

});
// display employee by department
app.get("/deaprtmentemployee/:department", async (req, res) => {
  let body = req.body;
  const Department = req.params.department;
  try {
    const result = await employeeModel.find({Department : Department}).exec(); // Using .exec() to execute the query
    console.log(Department);
    res.send({
      message: "Got all Emloyees successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});
app.get("/employeedetails/:id", async (req, res) => {
  let body = req.body;
  const ID = req.params.id;
  try {
    const result = await employeeModel.findOne({_id : ID}).exec(); // Using .exec() to execute the query
    console.log(ID);
    res.send({
      message: "Got Emloyees successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});
app.use("/api/v1", (req, res, next) => {
  console.log("req.cookies: ", req.cookies.Token);

  if (!req?.cookies?.Token) {
    res.status(401).send({
      message: "include http-only credentials with every request",
    });
    return;
  }

  jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
    if (!err) {
      console.log("decodedData: ", decodedData);

      const nowDate = new Date().getTime() / 1000;

      if (decodedData.exp < nowDate) {
        res.status(401);
        res.cookie("Token", "", {
          maxAge: 1,
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        res.send({ message: "token expired" });
      } else {
        console.log("token approved");

        req.body.token = decodedData;
        next();
      }
    } else {
      res.status(401).send("invalid token");
    }
  });
});
app.get("/api/v1/profile", (req, res) => {
  const _id = req.body.token._id;
  const getData = async () => {
    try {
      const user = await User.findOne(
        { _id: _id },
        "email password username -_id"
      ).exec();
      if (!user) {
        res.status(404).send({});
        return;
      } else {
        res.set({
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
        });
        res.status(200).send(user);
      }
    } catch (error) {
      console.log("error: ", error);
      res.status(500).send({
        message: "something went wrong on server",
      });
    }
  };
  getData();
});

import { spawn } from "child_process";

app.get("/predict/:id", async (req, res) => {
  let body = req.body;
  const ID = req.params.id;
  const pickleFilePath =  path.join('D:\React projects\Fy Hr Forcast\hr forcast backend\Models\scaler.pkl');


  try {
    const result = await employeeModel.findOne({_id : ID}).exec(); // Using .exec() to execute the query
    console.log('res',result.emloyeename);
    const options = {
      args: [JSON.stringify(result)],
    };
    console.log("opt",options)
    PythonShell.run(
      path.join('D:','React projects','Fy Hr Forcast','hr forcast backend', 'Models','scaler.pkl'),
      options,
      (err, results) => {
        if (err) {
          console.error('Error:', err.message);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        const predictionResult = JSON.parse(results[0]);
        res.json({ prediction: predictionResult });
      }
    );
    res.send({
      message: "Got Emloyees successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});

app.get('/predicts/:id', async (req, res) => {
  let body = req.body;
  const ID = req.params.id;
  const pickleFilePath = path.join('index.js', 'Models', 'scaler.pkl');  try {
    const result = await employeeModel.findOne({_id : ID}).exec(); // Using .exec() to execute the query
    console.log('res',result.emloyeename);
    const options = {
      args: [JSON.stringify(result)],
    };
    console.log("opt",options)

    PythonShell.run(
      path.join( 'D:','React projects','Fy Hr Forcast','hr forcast backend','predict_script.py'),
      options,
      (err, results) => {
        if (err) {
          console.error('Error:', err.message);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        const predictionResult = JSON.parse(results[0]);
        res.json({ prediction: predictionResult });
      }
    );
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// alert
app.get("/employeealert", async (req, res) => {

  try {
    const result1 = await employeeModel.find({ EnvironmentSatisfaction : 1, JobInvolvement: 1, JobSatisfaction: 1 }).exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all employee successfully",
      data: result1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
