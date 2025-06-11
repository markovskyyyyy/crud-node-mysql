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
    if (err) {
      console.error("Connection error:", err);
      return res.status(500).send("Internal server error");
    }

    conn.query("SELECT * FROM users WHERE email = ?", [data.email], (err, userdata) => {
      if (err) {
        console.error("Query error:", err);
        return res.status(500).send("Internal server error");
      }

      if (userdata.length > 0) {
        userdata.forEach((element) => {
          bcrypt.compare(data.password, element.password, (err, isMatch) => {
            if (err) {
              console.error("Bcrypt error:", err);
              return res.status(500).send("Internal server error");
            }

            if (!isMatch) {
              res.render("login/index", {
                error: "Contraseña incorrecta.",
              });
            } else {
              req.session.loggedin = true;
              req.session.name = element.name;
              req.session.userId = element.id;

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
    if (err) {
      console.error("Connection error:", err);
      return res.status(500).send("Internal server error");
    }

    conn.query("SELECT * FROM users WHERE email = ?", [data.email], (err, userdata) => {
      if (err) {
        console.error("Query error:", err);
        return res.status(500).send("Internal server error");
      }

      if (userdata.length > 0) {
        res.render("login/register", { error: "El usuario ya existe." });
      } else {
        bcrypt.hash(data.password, 12).then((hash) => {
          data.password = hash;

          req.getConnection((err, conn) => {
            if (err) {
              console.error("Connection error:", err);
              return res.status(500).send("Internal server error");
            }

            conn.query("INSERT INTO users SET ?", [data], (err, rows) => {
              if (err) {
                console.error("Insert error:", err);
                return res.status(500).send("Internal server error");
              }

              req.session.loggedin = true;
              req.session.name = data.name;
              req.session.userId = rows.insertId;

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
