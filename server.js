require("dotenv").config()
const express = require('express');
const fileUpload = require("express-fileupload");
const app = express()
const { checkAuthority } = require("./util")
// const firebase=
const postgres = require("postgres");

var admin = require("firebase-admin");

var serviceAccount = require("./resturant-69cb2-firebase-adminsdk-e1yjx-267b4e87ac.json");
const compression = require("compression");
const { readdirSync } = require("fs");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "resturant-69cb2.appspot.com"
});


app.use(compression({ level: 9 }))
app.use(fileUpload({}))
app.use(express.json())
app.use(require("cors")())
app.use("/l", require("./login").router)
app.use("/o", require("./owner").router)
app.use("/u", require("./user").router)
app.use("/w", require("./worker").router)
app.use(express.static(__dirname + "/"))
app.post("/st", async (req, res) => {


    const token = checkAuthority(req, [0, 2]);
    console.log(req.body);
    try {
        if (token == null) {
            res.sendStatus(404);
            return;
        }
        const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');

        (await sql`delete from tokens where userid=${token.i}`);
        (await sql`insert into tokens (userid,notificationtoken) values(${token.i},${req.body.t})`);
        sql.end()
        res.send({ e: 0 })
    } catch (error) {

        res.sendStatus(404)
    }

})


app.use(async (req, res) => {
    console.log(req.url);
    console.log(req.url.replace("/", ''));
    try {
        console.log("requesting a file");
        if (isNaN(Number(req.url.replace("/", '')))) {
            console.log("on condition");
            if (req.url.includes("packages")) {
                res.sendFile(__dirname + "/assets" + req.url)
            } else {

                res.sendFile(__dirname + req.url);

            }
            return;
        } else {

            console.log("failed the condition");
            console.log(isNaN(Number(req.url.replace("/", ''))));
            console.log((Number(req.url.replace("/", ''))));
        }
    } catch (error) {
        console.log("error happened");
    }
    try {

        const file = (await admin.storage().bucket().file(req.url.slice(1)).download());
        console.log(file);
        console.log(file[0]);
        console.log("this up there is the file");

        // (await require("fs/promises").writeFile('./' + req.url.slice(1), Buffer.from(file)));
        // res.sendFile(__dirname + "/" + req.url.slice(1))
        res.writeHead(200,[['Content-Type','image/png']]);
        res.end(Buffer.from(...file));

    } catch (error) {
       
            console.log("no such file");
            res.sendFile(__dirname + "/dns.png");
           
        
        console.log(error);
        console.log("error");

    }
    // console.log(req.body);
})

app.listen(3000, () => {


    console.log("The server is on !");

})

module.exports = {
    'app': admin
}