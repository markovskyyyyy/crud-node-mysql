function index(req, res) {
  const userId = req.session.userId; // Obtener el id del usuario de la sesión

  if (!userId) {
    // Si no hay usuario logueado, redirigir a la página de login
    return res.redirect("/login");
  }

  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM tasks WHERE user_id = ?", [userId], (err, tasks) => {
      if (err) {
        return res.json(err);
      }

      const loggedin = req.session.loggedin;
      const name = req.session.name;

      res.render("tasks/index", { tasks, name, loggedin });
    });
  });
}

function create(req, res) {
  const loggedin = req.session.loggedin;
  const name = req.session.name;
  res.render("tasks/create", { name, loggedin });
}

function store(req, res) {
  const data = req.body;
  const userId = req.session.userId; // Obtener el id del usuario de la sesión

  if (!userId) {
    return res.redirect("/login"); // Si no hay usuario logueado, redirigir al login
  }

  // Asignar el userId a la tarea antes de insertarla
  data.user_id = userId;

  req.getConnection((err, conn) => {
    conn.query("INSERT INTO tasks SET ?", [data], (err, rows) => {
      if (err) {
        return res.json(err);
      }
      res.redirect("/tasks");
    });
  });
}

function destroy(req, res) {
  const id = req.body.id;

  req.getConnection((err, conn) => {
    conn.query("DELETE FROM tasks WHERE id =?", [id], (err, rows) => {
      res.redirect("/tasks");
    });
  });
}

function edit(req, res) {
  const id = req.params.id;

  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM tasks WHERE id = ?", [id], (err, tasks) => {
      if (err) {
        res.json(err);
      }
      const loggedin = req.session.loggedin;

      const name = req.session.name;
      res.render("tasks/edit", { tasks, name, loggedin });
    });
  });
}

function update(req, res) {
  const id = req.params.id;
  const data = req.body;
  const userId = req.session.userId; // Obtener el id del usuario de la sesión

  if (!userId) {
    return res.redirect("/login"); // Si no hay usuario logueado, redirigir al login
  }

  req.getConnection((err, conn) => {
    // Primero, obtener la tarea para verificar si es del usuario logueado
    conn.query("SELECT * FROM tasks WHERE id = ? AND user_id = ?", [id, userId], (err, task) => {
      if (err) {
        return res.json(err);
      }

      if (task.length === 0) {
        return res.redirect("/tasks"); // Si la tarea no existe o no pertenece al usuario, redirigir
      }

      // Actualizar la tarea si la pertenece al usuario
      conn.query("UPDATE tasks SET ? WHERE id = ?", [data, id], (err, rows) => {
        if (err) {
          return res.json(err);
        }
        res.redirect("/tasks");
      });
    });
  });
}

module.exports = {
  index: index,
  create: create,
  store: store,
  destroy: destroy,
  edit: edit,
  update: update,
};
