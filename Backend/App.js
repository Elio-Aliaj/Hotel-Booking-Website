import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import chalk from "chalk";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

// await pool.query(
//   "INSERT INTO user (name,last, role, password, username) VALUES ('Ben','Hoshi','user','password','Ben-Hoshi')"
// );
const app = express();
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);
app.use(bodyParser.json());
const port = 3000;

app.get("/Rooms", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];

    const auth = jwt.verify(cookie, "secretKey");

    if (!auth) {
      return res.status(401).send({ message: "unauthorized" });
    }
    const [rooms] = await pool.query("SELECT * FROM room");

    res.json({ rooms, auth });
  } catch (error) {
    return res.status(401).send({ message: "unauthorized" });
  }
});

app.post("/Signup", async (req, res) => {
  req = req.body;

  if (
    req.first_name === undefined ||
    req.last_name === undefined ||
    req.username === undefined ||
    req.password === undefined ||
    req.first_name === "" ||
    req.last_name === "" ||
    req.username === "" ||
    req.password === ""
  ) {
    return res.status(400).send("Missing required parameters");
  }
  try {
    await pool.query(
      "INSERT INTO user (name, last, role,username,password) VALUES (?,?,?,?,?)",
      [
        req.first_name,
        req.last_name,
        req.role === undefined ? "user" : req.role,
        req.username,
        await encrypter(req.password),
      ]
    );
    console.log(chalk.green("Registered successfully"));
    res.status(200).json({ message: "Registered successfully" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).send("That username already exists");
    } else {
      console.error("An error occurred:", error);
    }
  }
});

app.post("/Login", async (req, res) => {
  req = req.body;
  if (
    req.username === undefined ||
    req.password === undefined ||
    req.username === "" ||
    req.password === ""
  ) {
    return res.status(400).send("Missing required parameters");
  }
  try {
    const [queryResponse] = await pool.query(
      "SELECT * FROM user WHERE username = ?",
      [req.username]
    );
    if (queryResponse.length !== 1) {
      console.log(chalk.red("Username dose not exist"));
      const error = new Error("Username dose not exist");
      error.status = 401;
      throw error;
    }

    if (!(await bcrypt.compare(req.password, queryResponse[0].password))) {
      console.log(chalk.red("Wrong password!"));
      const error = new Error("Wrong password!");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        username: queryResponse[0].username,
        role: queryResponse[0].role,
      },
      "secretKey"
    );

    res
      .cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .send({ message: "Success", role: queryResponse[0].role });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(error.status).json(error.message);
  }
});

app.post("/Logout", async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 }).send({ message: "Logout successfully" });
});

app.post("/Book", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];

    const auth = jwt.verify(cookie, "secretKey");

    if (!auth) {
      return res.status(401).send({ message: "unauthorized" });
    }
    req = req.body;
    const [exist] = await pool.query(
      "SELECT * FROM Booking WHERE reservation_date = ? AND room_id = ?",
      [req.bookDate, req.room]
    );
    if (exist.length > 0) {
      return res
        .status(409)
        .send({
          message:
            "This reservation already exists for that day, chose another day",
        });
    }
    await pool.query(
      "INSERT INTO Booking (username, room_id, reservation_date) VALUES (?,?,?)",
      [auth.username, req.room, req.bookDate]
    );

    res.status(200).send({ message: "ok" });
  } catch (error) {
    return res.status(401).send({ message: "unauthorized", error: error });
  }
});

app.listen(port, () => {
  console.log("Service listening on port " + port);
});

async function encrypter(password) {
  return await bcrypt.hash(password, 10);
}
