const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

let username = "";

app.get("/login", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Login</title>
      </head>
      <body>
        <h1>Login</h1>
        <form action="/login" method="post">
          <label for="username">Enter your username:</label>
          <input type="text" id="username" name="username" required>
          <button type="submit">Login</button>
        </form>
      </body>
    </html>
  `);
});


app.post("/login", (req, res) => {
  username = req.body.username;

  res.redirect("/");
});

app.post("/", (req, res) => {
  const message = req.body.message;

  if (!username || !message) {
    return res.status(400).send("Invalid request");
  }

  const logMessage = `${username}: ${message}\n`;

  fs.appendFile("messages.txt", logMessage, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving message");
    } else {
      res.redirect("/");
    }
  });
});


app.get("/", (req, res) => {
  fs.readFile("messages.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      data = "No chat history";
    }

    const usernameDisplay = username ? `<h2>Welcome, ${username}!</h2>` : "";

    res.send(`
      <html>
        <head>
          <title>Chat</title>
        </head>
        <body>
          <h1>Chat</h1>
          ${usernameDisplay}
          <h2>Chat History:</h2>
          <pre>${data}</pre>
          <form action="/" method="post">
            <input type="text" id="message" name="message" placeholder="Enter your message" required>
            <button type="submit">Send</button>
          </form>
        </body>
      </html>
    `);
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
