const express = require("express")
const { checkAuthority } = require("./util");
const postgres = require("postgres");
const router = express.Router()

//mark as in progress
router.post("/maip", async (req, res) => {

    const token = checkAuthority(req, [0]);
    console.log(token);

    try {
        if (token == null || (typeof (req.body.i) != 'number')) {

            res.send({
                e: 1
            })

        } else {

            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');

            await sql`update requests set status=1 where requestid=${req.body.i}`;
            (await sql`select notificationtoken,id from tokens inner join login on  login.id=tokens.userid where login.level=2`).forEach((modToken)=>{
                console.log(modToken);
                    require("./server").app.messaging().send({
                        token:modToken['notificationtoken'],
                        data:{
                            
                        },
                        notification:{
                            title:"تحديث",body:"يتم العمل على الطلب الخاص بك الرجاء الانتظار",
                        }
                    })
            })
            res.send({ e: 0 })
            sql.end()


        }
    } catch (error) {
        console.log(error);
        res.send({ e: 1 })
    }

})


//mark as done
router.post("/mad", async (req, res) => {

    const token = checkAuthority(req, [0]);
    console.log(token);

    try {
        if (token == null || (typeof (req.body.i) != 'number')) {

            res.send({
                e: 1
            })

        } else {

            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');

            await sql`update requests set status=2 where requestid=${req.body.i}`;
            (await sql`select notificationtoken,id from tokens inner join login on  login.id=tokens.userid where login.level=2`).forEach((modToken)=>{
                console.log(modToken);
                    require("./server").app.messaging().send({
                        token:modToken['notificationtoken'],
                        data:{
                            
                        },
                        notification:{
                            title:"تحديث",body:"تم الانتهاء من طلبك",
                        }
                    })
            })
            res.send({ e: 0 })
            sql.end()


        }
    } catch (error) {
        console.log(error);
        res.send({ e: 1 })
    }

})
//mark as done
router.post("/del", async (req, res) => {

    const token = checkAuthority(req, [0]);
    console.log(token);

    try {
        if (token == null || (typeof (req.body.i) != 'number')) {

            res.send({
                e: 1
            })

        } else {

            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');

            await sql`delete from requests where requestid=${req.body.i}`;
            res.send({ e: 0 })
            sql.end()


        }
    } catch (error) {
        console.log(error);
        res.send({ e: 1 })
    }

})


module.exports = {
    'router': router
}