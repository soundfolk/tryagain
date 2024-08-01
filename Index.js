const exp = require("express")
const https = require("http").Server(exp());
const paths = require("path")
const app = exp()

app.use(exp.static(paths.join(__dirname, "public")));

app.get("/", (req, res) => {
    var file = paths.join(__dirname, "public", "index.html"); // Assuming Index.html is in public directory
    res.sendFile(file, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error serving Index.html");
        }
    });


})

const io = require('socket.io')(https)

const users = {}

io.on("connection", socket => {
    console.log("Hello")
    socket.on("join", (name) => {
        users[socket.id] = name
        console.log(`${name} has joined`); // Log a message when a user joins
        socket.broadcast.emit("userJoined", name);
    })
    socket.on("send", data => {
        socket.broadcast.emit("recv", { names: users[socket.id], mess: data })
    })
})
const port = process.env.PORT || 5000;

https.listen(port, () => {
    console.log("User joined")
})