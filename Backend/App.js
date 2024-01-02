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
import multer from "multer";

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

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

    const auth = jwt.verify(cookie, process.env.AUTH_KEY);

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
      process.env.AUTH_KEY
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

    const auth = jwt.verify(cookie, process.env.AUTH_KEY);

    if (!auth) {
      return res.status(401).send({ message: "unauthorized" });
    }
    req = req.body;
    const [exist] = await pool.query(
      "SELECT * FROM Booking WHERE reservation_date = ? AND room_id = ?",
      [req.bookDate, req.room]
    );
    if (exist.length > 0) {
      return res.status(409).send({
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

app.get("/Users", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];

    const auth = jwt.verify(cookie, process.env.AUTH_KEY);

    if (!auth) {
      return res.status(401).send({ message: "unauthorized" });
    }
    if (auth.role !== "admin") {
      return res.status(401).send({ message: "unauthorized" });
    }
    const [users] = await pool.query(
      "SELECT name, last, role, username FROM user WHERE username <> ?",
      [auth.username]
    );

    res.status(200).send({ users, auth });
  } catch (error) {
    return res.status(401).send({ message: "unauthorized", error: error });
  }
});

app.get("/Booking", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];

    const auth = jwt.verify(cookie, process.env.AUTH_KEY);

    if (!auth) {
      return res.status(401).send({ message: "unauthorized" });
    }
    if (auth.role !== "admin") {
      return res.status(401).send({ message: "unauthorized" });
    }
    const [bookings] = await pool.query("SELECT * FROM Booking");

    res.status(200).send({ bookings, auth });
  } catch (error) {
    return res.status(401).send({ message: "unauthorized", error: error });
  }
});

app.get("/auth", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];

    const auth = jwt.verify(cookie, process.env.AUTH_KEY);

    if (!auth) {
      return res.status(401).send({ message: "unauthorized" });
    }

    res.status(200).send({ auth });
  } catch (error) {
    return res.status(401).send({ message: "unauthorized", error: error });
  }
});

const upload = multer({ storage: multer.memoryStorage() });

app.put("/editUser", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];

    const auth = jwt.verify(cookie, process.env.AUTH_KEY);

    if (!auth || auth.role !== "admin") {
      return res.status(401).send({ message: "unauthorized" });
    }

    await pool.query(
      "UPDATE user SET username = ?, name = ?, last = ?, role = ? WHERE username = ?",
      [
        req.body.formData.username,
        req.body.formData.name,
        req.body.formData.last,
        req.body.formData.role,
        req.body.username,
      ]
    );
    await pool.query("UPDATE Booking SET username = ? WHERE username = ?", [
      req.body.formData.username,
      req.body.username,
    ]);

    return res.status(200).send({ message: "User Edited Successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).send(e);
  }
});
app.put("/editBookings", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];
    const auth = jwt.verify(cookie, process.env.AUTH_KEY);
    if (!auth || auth.role !== "admin") {
      return res.status(401).send({ message: "unauthorized" });
    }
    try {
      const [[dateExists]] = await pool.query(
        "SELECT EXISTS (SELECT 1 FROM booking WHERE room_id = ? AND reservation_date = ?) AS date_exists",
        [req.body.formData.room, req.body.formData.date]
      );
      if (dateExists.date_exists == 1) {
        return res
          .status(409)
          .send({ message: "This Reservation exists already" });
      } else {
        await pool.query(
          "UPDATE Booking SET username = ?, room_id = ?, reservation_date = ? WHERE booking_id = ?",
          [
            req.body.formData.username,
            req.body.formData.room,
            req.body.formData.date,
            req.body.booking_id,
          ]
        );
      }
    } catch (err) {
      console.log(err);
    }

    return res.status(200).send({ message: "Booking Edited Successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).send(e);
  }
});
app.post("/addRoom", upload.single("image"), async (req, res) => {
  if (req.file === undefined) {
    return res.status(404).send({ message: "File not found" });
  } else if (req.file.size > 14000000) {
    return res
      .status(413)
      .send({ message: "File size exceeds maximum allowed" });
  }
  try {
    const cookie = req.cookies["jwt"];

    const auth = jwt.verify(cookie, process.env.AUTH_KEY);

    if (!auth || auth.role !== "admin") {
      return res.status(401).send({ message: "unauthorized" });
    }
    const image = req.file.buffer.toString("base64");

    await pool.query(
      "INSERT INTO room (surface, orientation, nightly_price, image) VALUES (?, ?, ?, ?)",
      [req.body.surface, req.body.orientation, req.body.nightly_price, image]
    );

    return res.status(200).send({ message: "Room Card Added Successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).send(e);
  }
});

app.delete("/deleteRoom/:roomId", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];

    const auth = jwt.verify(cookie, process.env.AUTH_KEY);

    if (!auth || auth.role !== "admin") {
      return res.status(401).send({ message: "unauthorized" });
    }
    await pool.query("DELETE FROM Room WHERE room_id = ?", [req.params.roomId]);
    await pool.query("DELETE FROM Booking WHERE room_id = ?", [
      req.params.roomId,
    ]);

    res.status(200).send({ message: "Room Card Deleted Successfully" });
  } catch (error) {
    return res.status(401).send({ message: "unauthorized", error: error });
  }
});

app.delete("/deleteBook/:bookID", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];

    const auth = jwt.verify(cookie, process.env.AUTH_KEY);

    if (!auth || auth.role !== "admin") {
      return res.status(401).send({ message: "unauthorized" });
    }
    await pool.query("DELETE FROM Booking WHERE booking_id = ?", [
      req.params.bookID,
    ]);

    res.status(200).send({ message: "Booking Deleted Successfully" });
  } catch (error) {
    return res.status(401).send({ message: "unauthorized", error: error });
  }
});

app.delete("/deleteUser/:userID", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];

    const auth = jwt.verify(cookie, process.env.AUTH_KEY);

    if (!auth || auth.role !== "admin") {
      return res.status(401).send({ message: "unauthorized" });
    }
    console.log(req.params.userID);
    await pool.query("DELETE FROM Booking WHERE username = ?", [
      req.params.userID,
    ]);

    await pool.query("DELETE FROM user WHERE username = ?", [
      req.params.userID,
    ]);

    res.status(200).send({ message: "User Deleted Successfully" });
  } catch (error) {
    return res.status(401).send({ message: "unauthorized", error: error });
  }
});

app.put("/editRoom", async (req, res) => {
  if (req.file === undefined) {
    return res.status(404).send({ message: "File not found" });
  } else if (req.file.size > 14000000) {
    return res
      .status(413)
      .send({ message: "File size exceeds maximum allowed" });
  }
  try {
    const cookie = req.cookies["jwt"];

    const auth = jwt.verify(cookie, process.env.AUTH_KEY);

    if (!auth || auth.role !== "admin") {
      return res.status(401).send({ message: "unauthorized" });
    }
    const image = req.file.buffer.toString("base64");

    await pool.query(
      "UPDATE room SET surface = ?, orientation = ?, nightly_price = ?, image = ? WHERE room_id = ?",
      [
        req.body.surface,
        req.body.orientation,
        req.body.nightly_price,
        image,
        req.body.roomId,
      ]
    );

    return res.status(200).send({ message: "Room Card Edited Successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).send(e);
  }
});

app.listen(port, () => {
  console.log(
    chalk.bgHex("#460171")(
      "-----------------:: Service listening on port: " +
        port +
        " ::-----------------"
    )
  );
});

async function encrypter(password) {
  return await bcrypt.hash(password, 10);
}
