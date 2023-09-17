const express = require("express");
const { engine } = require("express-handlebars");
const myconnection = require("express-myconnection");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const trasksRoutes = require("./routes/tasks");

const app = express();
app.set("port", 4000);

app.set("views", __dirname + "/views");
app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(
  myconnection(
    mysql,
    {
      host: "localhost",
      user: "root",
      password: "",
      database: "crudnodejs",
    },
    "single"
  )
);

app.listen(app.get("port"), () => {
  console.log("listening on port ", app.get("port"));
});

app.use("/", trasksRoutes);

app.get("/", (req, res) => {
  res.render("home");
});
