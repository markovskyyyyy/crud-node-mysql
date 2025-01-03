const express = require("express");
const { engine } = require("express-handlebars");
const myconnection = require("express-myconnection");
const mysql = require("mysql");
const session = require("express-session");
const bodyParser = require("body-parser");
const tasksRoutes = require("./routes/taskRoutes/tasks");
const loginRoutes = require("./routes/loginRoutes/login");

const app = express();

// Configuración del puerto
app.set("port", 4000);

// Configuración de vistas y Handlebars
app.set("views", __dirname + "/views");
app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");

// Middlewares
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(
  myconnection(mysql, {
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: "crudnodejs",
  })
);

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Rutas
app.use("/", loginRoutes);
app.use("/", tasksRoutes);

// Rutas específicas
app.get("/", (req, res) => {
  if (req.session.loggedin) {
    res.render("home", { name: req.session.name });
  } else {
    res.redirect("/login");
  }
});

// Iniciar el servidor
app.listen(app.get("port"), () => {
  console.log("listening on port", app.get("port"));
});
