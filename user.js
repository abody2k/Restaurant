const express = require("express")
const { checkAuthority } = require("./util");
const postgres = require("postgres");
const router = express.Router()

//get everything , categories, favorites and food
router.post("/ge", async (req, res) => {

    const token = checkAuthority(req, [2,0]);
    console.log(token);

    try {
        if (token == null) {

            res.sendStatus(404);

        } else {

            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');
            console.log("here");
            res.send({
                e:0,
                ff: (await sql`select * from favorites where userid=${token.i}`),
                g: (await sql`select * from categories`),
                f: (await sql`select * from food`),
                // c: (await sql`select * from components`),
                t: (await sql`select * from translations`),
            })

            sql.end()


        }
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }

})

//get everything , categories, favorites and food
router.post("/uf", async (req, res) => {

    const token = checkAuthority(req, [2]);
    console.log(req.body);
    console.log(token);

    try {
        if (token == null) {

            res.sendStatus(404);

        } else {

            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');
            (await sql`delete from favorites where userid=${token.i}`);
            
            for (let i = 0; i < req.body.f.length; i++) {
                (await sql`insert into favorites (userid,foodid) values(${token.i},${req.body.f[i]})`);

            }

            
            res.send({
                e:0,
            })

            sql.end()


        }
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }

})


router.post("/cs", async (req, res) => {

    const token = checkAuthority(req, [2]);
    console.log(token);

    try {
        if (token == null) {

            res.sendStatus(404);

        } else {

            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');
            const ans =(await sql`select status from requests where requestid=(select max(requestid) from requests)and senderid=${token.i} `)
            res.send({
                e:0,
                v:ans[0]['status'],
                c:ans.length    
            })

            sql.end()


        }
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }

})

 
//buy food
router.post("/bf", async (req, res) => {
    console.log('new reqiest');
    console.log(typeof(req.body.r));
    const token = checkAuthority(req, [2]);
    console.log(token);

    try {
        if (token == null || typeof (req.body.r) != 'object') {

            res.send({
                e: 1
            })

        } else {


            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');
     

try {
    (await sql`insert into requests (senderid,request,status,type,location,date) values(${token.i},${JSON.stringify(req.body.r)},0,${0},${JSON.stringify(

        {

            "l":1321323
        }
    )},now())`)

} catch (error) {
    console.log(`(${token.i},${JSON.stringify(req.body.r)},0,${req.body.t},${JSON.stringify(

        {

            "l":1321323
        }
    )}`);
    console.log(error);
}

        (await sql`select notificationtoken,id from tokens inner join login on  login.id=tokens.userid where login.level=0`).forEach((modToken)=>{
            console.log(modToken);
                console.log("sending notification");
              
                require("./server").app.messaging().send({
                    token:modToken['notificationtoken'],
                    data:{
                        
                    },
                    notification:{
                        title:"طلب جديد",body:"يوجد طلب توصيل جديد",
                    }
                })
        })
                res.send({
                e: 0,
        
            })

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