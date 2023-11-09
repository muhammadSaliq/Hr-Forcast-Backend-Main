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
    const { emloyeename, age, businessTravel,dailyRate,department , distanceFromHome, education,educationField,
      employeeNumber, environmentSatisfaction,gender,hourlyRate,jobInvolvement, jobLevel,jobRole,jobSatisfaction,maritalStatus,
      monthlyIncome,monthlyRate,numCompaniesWorked,over18, overTime, percentSalaryHike, performanceRating,relationshipSatisfaction,standardHours,
      stockOptionLevel, totalWorkingYears,trainingTimesLastYear, workLifeBalance,yearsAtCompany,yearsInCurrentRole,yearsSinceLastPromotion,yearsWithCurrManager
    } = req.body;

 
    // Create a new user
    const newEmployee = new employeeModel({
      emloyeename,
      age,
      businessTravel,
      dailyRate,
      department,
      distanceFromHome,
      education,
      educationField,
      
      employeeNumber,
      environmentSatisfaction,
      gender,
      hourlyRate,
      jobInvolvement,
      jobLevel, 
      jobRole,
      jobSatisfaction,
      maritalStatus,
      monthlyIncome,
      monthlyRate,
      numCompaniesWorked,
      over18,
      overTime,
      percentSalaryHike,
      performanceRating,
      relationshipSatisfaction,
      standardHours,
      stockOptionLevel,
      totalWorkingYears,
      trainingTimesLastYear,
      workLifeBalance,
      yearsAtCompany,
      yearsInCurrentRole,
      yearsSinceLastPromotion,
      yearsWithCurrManager
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
    const result = await employeeModel.find().exec(); // Using .exec() to execute the query
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

//department
app.post("/adddepartments", async (req, res) => {

  try {
    const { departmentname  } = req.body;
    const existingUser = await departmentModel.findOne({ departmentname });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
 
    const newDepartment = new departmentModel({
      departmentname,
      
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

// display employee by department
app.get("/deaprtmentemployee/:department", async (req, res) => {
  let body = req.body;
  const Department = req.params.department;
  try {
    const result = await employeeModel.find({department : Department}).exec(); // Using .exec() to execute the query
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
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
