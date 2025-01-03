const bcrypt = require("bcrypt");

function login(req, res) {
  if (req.session.loggedin != true) {
    res.render("login/index");
  } else {
    res.redirect("/");
  }
}

function auth(req, res) {
  const data = req.body;

  req.getConnection((err, conn) => {
    conn.query("select * from users where email = ?", [data.email], (err, userdata) => {
      if (userdata.length > 0) {
        userdata.forEach((element) => {
          bcrypt.compare(data.password, element.password, (err, isMatch) => {
            if (!isMatch) {
              res.render("login/index", {
                error: "Contraseña incorrecta.",
              });
            } else {
              req.session.loggedin = true;
              req.session.name = element.name;
              req.session.userId = element.id; // Guardar el id del usuario en la sesión

              res.redirect("/");
            }
          });
        });
      } else {
        res.render("login/index", { error: "El usuario no existe." });
      }
    });
  });
}

function register(req, res) {
  if (req.session.loggedin != true) {
    res.render("login/register");
  } else {
    res.redirect("/");
  }
}
function storeUser(req, res) {
  const data = req.body;

  req.getConnection((err, conn) => {
    conn.query("select * from users where email = ?", [data.email], (err, userdata) => {
      if (userdata.length > 0) {
        res.render("login/register", { error: "El usuario ya existe." });
      } else {
        bcrypt.hash(data.password, 12).then((hash) => {
          data.password = hash;
          req.getConnection((err, conn) => {
            conn.query("insert into users set ?", [data], (err, rows) => {
              // Al registrar, también guardamos el id del nuevo usuario en la sesión
              req.session.loggedin = true;
              req.session.name = data.name;
              req.session.userId = rows.insertId; // Guardar el id del usuario recién creado

              res.redirect("/");
            });
          });
        });
      }
    });
  });
}
function logout(req, res) {
  if (req.session.loggedin == true) {
    req.session.destroy();
  }
  res.redirect("/login");
}

module.exports = {
  login,
  register,
  storeUser,
  auth,
  logout,
};
