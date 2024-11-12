const express = require("express")
const { checkAuthority } = require("./util");
const postgres = require("postgres");
// const { getAuth, signInWithPhoneNumber } = require("@firebase/auth");
const router = express.Router()
const admin = require('firebase-admin');
const { sign } = require("jsonwebtoken");
const { verify } = require("argon2");

// phone number authentication
// checks if the phone number exists in the database or not
router.post("/pna", async (req, res) => {



    try {
        if ((typeof (req.body.pn) != 'string')) {

            res.send({
                e: 1
            })
        } else {
            console.log(req.body);

            if (req.body.pn.length < 10 || req.body.pn.length > 15) {

                res.send({
                    e: 1
                })
                return;
            }
            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');

            let response = (await sql`select * from login where contact=${req.body.c}`)

            if (response.length > 0) {
                res.send({
                    e: 0,
                })

            } else {
                res.send({
                    e: 1 // no such account
                })
                return;
            }

            sql.end()


        }
    } catch (error) {
        console.log(error);
        res.send({ e: 1 })
    }

})

//phone number verification
router.post("/pnv", async (req, res) => {


    console.log("new request");
    console.log(req.body);

    try {
        if ((typeof (req.body.t) != 'string') || (typeof (req.body.pn) != 'string')) {

            res.send({
                e: 1
            })
        } else {
            try {
                // await admin.auth().verifyIdToken(req.body.t);
                const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');
                let user = (await sql`select * from login where username=${req.body.pn}`);

                res.send({
                    e: 0,
                    u: user.username,
                    l: user.level,
                    i: user.id,
                    t: sign({
                        u: user.username,
                        l: user.level,
                        i: user.id,
                    }, process.env.password, { expiresIn: "10y" })

                })

                sql.end()

            } catch (error) {
                console.log(error);
                res.send({
                    e: 1
                })
            }



        }
    } catch (error) {
        console.log(error);
        res.send({ e: 1 })
    }

})

//password and email verification
router.post("/pev", async (req, res) => {


    console.log("new request");
    console.log(req.body);

    try {
        if ((typeof (req.body.e) != 'string') || (typeof (req.body.p) != 'string')) {

            res.send({
                e: 1
            })

        } else {
            try {
                // await admin.auth().verifyIdToken(req.body.t);
                const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');

                let user = (await sql`select * from login where username=${req.body.e}`);
                if (user.length > 0) {

                    try {
                        console.log(user);
                        console.log(req.body);
                        verify(user[0].password, req.body.p).then((e)=>{
                            console.log(e);

                            if(!e) throw "error"
                            else{
                                res.send({
                                    e: 0,
                                    u: user[0].username,
                                    l: user[0].level,
                                    i: user[0].id,
                                    t: sign({
                                        u: user[0].username,
                                        l: user[0].level,
                                        i: user[0].id,
                                    }, process.env.password, { expiresIn: "10y" })
                                })

                            }

                        }).catch((e)=>{
                            console.log(e);
                        })
                      

                    } catch (error) {
                        console.log(error);
                        console.log("error happened");
                        res.sendStatus(404)

                    }
                } else {
                    res.sendStatus(404)

                }
                sql.end()

            } catch (error) {
                console.log(error);
                res.sendStatus(404)

            }



        }
    } catch (error) {
        console.log(error);
        res.sendStatus(404)
    }

})


//verify token
router.post("/vt", async (req, res) => {
    console.log("new request");
    const token = checkAuthority(req, [0,1,2]);
    console.log(token);

    try {
        if (token == null) {

            res.sendStatus(404);

        } else {
            res.send({
                e:0,
                d:token
            })

        }
    } catch (error) {
        console.log(error);
        res.send({ e: 1 })
    }

})



module.exports = {
    'router': router
}