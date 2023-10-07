const express = require("express");
const app = express();
const port = 4000;
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ruta raiz");
});

app.get("/api", validateToken, (req, res) => {
  res.json({
    tuits: [
      {
        id: 0,
        text: "primer tuit",
        username: "Menfi",
      },
      {
        id: 1,
        text: "primer tuit",
        username: "Stefany",
      },
    ],
  });
});

app.get("/login", (req, res) => {
  res.send(`<!DOCTYPE html>
    <html lang="es">
    <head>
        <title>Login</title>
    </head>
    <body>
        <form method="post" action="/auth">
            Nombre de Usuario: <input type="text" name="text"><br>
            Contraseña:<input type="password" name="password"><br>
            <input type="submit" value="Iniciar Sesion">
        </form>
    </body>
    </html>`);
});

app.post("/auth", (req, res) => {
  const { username, password } = req.body;
  const user = { username: username };
  const accessToken = generateAccessToken(user);
  res.header("autorizacion", accessToken).json({
    message: "usuario autenticado",
    token: accessToken,
  });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.SECRET, { expiresIn: "5m" });
}

function validateToken(req, res, next) {
  const accessToken = req.headers["autorizacion"];
  if (!accessToken) res.send("Acceso Denegado");

  jwt.verify(accessToken, process.env.SECRET, (err, user) => {
    if (err) {
      res.send("Acceso denegado, token expirado o incorrecto");
    } else {
      next();
    }
  });
}

app.listen(port, () => {
  console.log(`servidor iniciando en el puerto ${port}`);
});
