const homeRouter = require("./routes/home-route");
const userRouter = require("./routes/users-ruote");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require('path');
require("dotenv").config();

const app = express();

const port = process.env.SERVER_PORT || 5500;
app.listen(port, function () {
    console.log(`Server is running on port ${port}`);
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded());
app.use(helmet());

app.get("env");
if (app.get("env") === "development") app.use(morgan("short"));

app.use('/', homeRouter);
app.use('/api/users', userRouter)

