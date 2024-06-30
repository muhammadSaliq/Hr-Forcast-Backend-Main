import express from "express";
import User from "./Models/User.js"; // Adjust the path based on your directory structure
import jwt from "jsonwebtoken"; // Import the jsonwebtoken library
const app = express();
const port = process.env.PORT || 8000; // Use process.env.PORT for flexibility
import cors from "cors";
const SECRET = process.env.SECRET || "topsecret";
import cookieParser from "cookie-parser";
import { employeeModel } from "./Models/User.js";
import { departmentModel } from "./Models/User.js";



app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Final Year Project ");
});

//hr users signup
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

// hr user login
app.post("/login", async (req, res) => {
  try {
    // get data from body
    let body = req.body;
    console.log("ss")
    console.log("sasa", body)

    body.email = body.email.toLowerCase();

    //validation
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

      //json web token data
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

      // setting cookies 
      res.cookie("Token", token, {
        maxAge: 86_400_000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      // on successfull login, these cookies are set
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
    // get data from body
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

// api to get all active emloyees
app.get("/allemployees", async (req, res) => {
  console.log("all emp api running")
  try {
    const result = await employeeModel.find({ executive: "1" }).exec(); // Using .exec() to execute the query
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

// all inactive employees
app.get("/allemployeesbench", async (req, res) => {
  try {
    const result = await employeeModel.find({ executive: "0" }).exec(); // Using .exec() to execute the query
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

// get single employee by id to edit
  app.get("/geteditemployee/:id", async (req,res) => {     

    const EmpId = req.params.id;
    const Employee = await employeeModel.findOne({_id:EmpId});
  
    res.send({message: "customer found", Product : Employee})
  });

  // edit employee data
app.put("/editemployee/:id", async (req,res) => {

  const employeeId = req.params.id;
  const updatedEmloyeeData = req.body;
  const UpdatedbyUser = req.body.UpdatedbyUser
console.log("empid",employeeId)
console.log("dta",updatedEmloyeeData)
console.log("upsr",UpdatedbyUser)

  try{
    //find by employee id and update
  const employeeData = await employeeModel.findByIdAndUpdate(employeeId, updatedEmloyeeData, {
    new: true, // Return the updated employeeData
  });
  //if employee not found
  if (!employeeData) {
    return res.status(404).json({ message: 'employee Data not found' });
  }

  res.json(product);
}
catch {
  res.status(500).json({ message: 'Server Error' });
}


});

// api to delete employee by setting executive to 0

app.get("/deleteemployee/:id", async (req, res) => {
  const id = req.params.id;

  try {
    //find employee
    const FindData = await employeeModel.findById({ _id: id });

    // updating executive
    if (FindData) {
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

//adding new department
app.post("/adddepartments", async (req, res) => {

  try {
    // get dep data from body
    const { departmentname, contact, departmentmanager, description  } = req.body;
    const existingUser = await departmentModel.findOne({ departmentname });

    // no dep with same name can be added
    if (existingUser) {
      return res.status(400).json({ error: "department already exists" });
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

//get all department from DB 
app.get("/alldepartments", async (req, res) => {
  try {
    const result = await departmentModel.find().exec(); // Using .exec() to execute the query
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

//total counts
app.get("/employeedepartmentstotal", async (req, res) => {
  try {
    const hrresult = await employeeModel.find({Department: "HR Department"}).exec(); // Using .exec() to execute the query
    const result = await employeeModel.find({Department: "IT Department"}).exec();
    const result2 = await employeeModel.find({Department: "Financial department"}).exec();
    const result3 = await employeeModel.find({Department: "Strategic division"}).exec();
    const result4 = await employeeModel.find({Department: "IT"}).exec();
    const result5 = await employeeModel.find({Department: "Kiet Departments of Sciences"}).exec();
    const counthr= hrresult.length
    const countit= result.length
    const countfi= result2.length
    const countitde= result4.length
    const countki= result5.length
    const countst= result3.length

    res.send({
      message: "Got all department successfully",
      hrtotal: counthr,
      itreasult: countit,
      fitotal: countfi,
      sttotal: countst,
      itdeptotal: countitde,
      kitotal: countki,
      
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});

app.get("/employeeducationfieldtotal", async (req, res) => {
  try {
    const lsresult = await employeeModel.find({EducationField: "Life Sciences"}).exec(); // Using .exec() to execute the query
    const result = await employeeModel.find({EducationField: "Medical"}).exec();
    const result2 = await employeeModel.find({EducationField: "Marketing"}).exec();
    const result3 = await employeeModel.find({EducationField: "Technical Degree"}).exec();
    const result4 = await employeeModel.find({EducationField: "Human Resources"}).exec();
    const result5 = await employeeModel.find({EducationField: "Other"}).exec();
    const countls= lsresult.length
    const countme= result.length
    const countmar= result2.length
    const counthr= result4.length
    const countot= result5.length
    const counttd= result3.length

    res.send({
      message: "Got all department successfully",
      lstotal: countls,
      mereasult: countme,
      martotal: countmar,
      tdtotal: counttd,
      hrtotal: counthr,
      ottotal: countot,
      
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});

app.get("/employeejobroletotal", async (req, res) => {
  try {
    const hrresult = await employeeModel.find({JobRole: "Sales Executive"}).exec(); // Using .exec() to execute the query
    const result = await employeeModel.find({JobRole: "Research Scientist"}).exec();
    const result2 = await employeeModel.find({JobRole: "Laboratory Technician"}).exec();
    const result3 = await employeeModel.find({JobRole: "Manufacturing Director"}).exec();
    const result4 = await employeeModel.find({JobRole: "Healthcare Representative"}).exec();
    const result5 = await employeeModel.find({JobRole: "Manager"}).exec();
    const result6 = await employeeModel.find({JobRole: "Sales Representative"}).exec();
    const result7 = await employeeModel.find({JobRole: "Research Director"}).exec();
    const result8 = await employeeModel.find({JobRole: "Human Resources"}).exec();

    const countse= hrresult.length
    const countresci= result.length
    const countlt= result2.length
    const counthr= result4.length
    const countman= result5.length
    const countmd= result3.length
    const countsr= result6.length
    const countrd= result7.length
    const counthres= result8.length

    res.send({
      message: "Got all department successfully",
      setotal: countse,
      rescireasult: countresci,
      lttotal: countlt,
      mdtotal: countmd,
      hrdeptotal: counthr,
      mantotal: countman,
      srtotal: countsr,
      rdtotal: countrd,
      restotal: counthres
      
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});

app.get("/employeegendertotal", async (req, res) => {
  try {
    const lsresult = await employeeModel.find({Gender: "Male"}).exec(); // Using .exec() to execute the query
    const result = await employeeModel.find({Gender: "Female"}).exec();
    const result2 = await employeeModel.find({MaritalStatus: "Single"}).exec();
    const result3 = await employeeModel.find({MaritalStatus: "Married"}).exec();
    const result4 = await employeeModel.find({MaritalStatus: "Divorced"}).exec();
    const result5 = await employeeModel.find({Over18: "Yes"}).exec();
    const result6 = await employeeModel.find({Over18: "No"}).exec();
    const result8 = await employeeModel.find({executive: "1"}).exec();
    const result9 = await departmentModel.find().exec();

    const countmale= lsresult.length
    const countfemale= result.length
    const countsingle= result2.length
    const countmarried= result3.length
    const countdivorced= result4.length
    const count18a= result5.length
    const count18b= result6.length
    const totalemloyees= result8.length
const totaldep= result9.length
    res.send({
      message: "Got all department successfully",
      maletotal: countmale,
      femalereasult: countfemale,
      singletotal: countsingle,
      marriedtotal: countmarried,
      divorcedtotal: countdivorced,
      ageatotal: count18a,
      agebtotal: count18b,
      totalemloyees: totalemloyees,
      totaldep: totaldep
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});

//get single department to edit them
app.get("/geteditdepaprtment/:id", async (req,res) => {     

  const DepId = req.params.id;
  const department = await departmentModel.findOne({_id:DepId});

  res.send({message: "customer found", Product : department})
});

// api to edit the department
app.put("/editdepartment/:id/:name/:old", async (req,res) => {

  // get data from params
  const depId = req.params.id; // dep id
  const depname = req.params.name; //new dep name
  const depoldname = req.params.old; // old dep name

// get updated data from header
  const updatedDepartmentData = req.body;
  // to see data in console
  console.log("deps", updatedDepartmentData.departmentname)
  console.log("depnames", depname)

  try{
    const result = await employeeModel.find({Department : depname}).exec();  

    //ffind dep and updating it with new data
  const departmentData = await departmentModel.findByIdAndUpdate(depId, updatedDepartmentData, {
    new: true, // Return the updated departmentData
  });
  //updating employee's department with updated department name
  await employeeModel.updateMany(
    { Department: depoldname },  // find emp by old name
    { $set: { Department: depname } }  // setting the new updated data
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


// set department as inactive

app.get("/deletedepartment/:id/:name", async (req, res) => {
  const id = req.params.id;
  const name = req.params.name;
console.log("dep", name)
  try { // find emp and dep data
    const FindData = await departmentModel.findById({ _id: id });
    const result = await employeeModel.find({Department : name}).exec();
    console.log("res", result)

    if (FindData) {
      
   await FindData.updateOne({ executive: "0" });  // setting department as inactive
   // setting all employee in the current dep as inactive
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

//api to activate department
app.get("/activedepartment/:id/:name", async (req, res) => {
  const id = req.params.id;
  const name = req.params.name;

  try {
    const FindData = await departmentModel.findById({ _id: id });

    if (FindData) {

     // activating department
   await FindData.updateOne({ executive: "1" });

   //activating employee of current dep
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
// display employees in current department 
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

//ai to get the parameters of a single employee
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

// api to verify json web token
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

// api to get user profile
app.get("/api/v1/profile", (req, res) => {
  const _id = req.body.token._id;

  // getting hr user data
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


app.get("/alerttotal", async (req, res) => {

  try {
    // gettng data using 3 main parameters
    const result1 = await employeeModel.find({ EnvironmentSatisfaction : 1, JobInvolvement: 1, JobSatisfaction: 1 }).exec(); // Using .exec() to execute the query
    // console.log(result);
    const result= result1.length
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

// alert hr if emp abot to leave
app.get("/employeealert", async (req, res) => {

  try {
    // gettng data using 3 main parameters
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

//search employee

app.get("/api/searchlist", async (req, res) => {
  const searchParams = {};
      console.log("src",req.query)

  // Check if query parameters exist and add them to the search parameters
  if (req.query.EmployeeNumber) {
    searchParams.EmployeeNumber = new RegExp(req.query.EmployeeNumber, "i");
  }
  if (req.query.Age) {
    searchParams.Age = { $lte: parseInt(req.query.Age) };
  }
  if (req.query.JobRole) {
    searchParams.JobRole = new RegExp(req.query.JobRole, "i");
  }
  if (req.query.Gender) {
    searchParams.Gender = new RegExp(req.query.Gender, "i");
  }
  if (req.query.Department) {
    searchParams.Department = new RegExp(req.query.Department, "i");
  }

  try {
    const results = await employeeModel.find(searchParams);
    //console.log("inside try", results)
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/logouts", async (req, res) => {
  try {
    let body = req.body;
    body.email = body.email.toLowerCase();



    // check if user exists
    const data = await User.findOne(
      { email: body.email },
      "username email password"
    );

    if (data && body.password === data.password) {
      // user found
      console.log("User Successfully Logged out !");
      console.log("data: ", data);

      const token = jwt.sign(
        {
          _id: data._id,
          email: data.email,
          iat: 0,
          exp: 0,
        },
        SECRET
      );

      console.log("token: ", token);

      res.cookie("Token", token, {
        maxAge: 0,
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


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
