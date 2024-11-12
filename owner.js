const express = require("express")
const { checkAuthority } = require("./util");
const postgres = require("postgres");
const { app, storage } = require("firebase-admin");
const router = express.Router()

 
//buy food
router.post("/bf", async (req, res) => {
    console.log('new reqiest');
    console.log(typeof(req.body.r));
    const token = checkAuthority(req, [0]);
    console.log(token);

    try {
        if (token == null || typeof (req.body.r) != 'object') {

            res.send({
                e: 1
            })

        } else {


            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');
     

try {
    (await sql`insert into requests (senderid,request,status,type,location,date) values(${token.i},${JSON.stringify(req.body.r)},2,${req.body.t},${JSON.stringify(

        {

            "l":1321323
        }
    )},now())`)

} catch (error) {
    console.log(`(${token.i},${JSON.stringify(req.body.r)},0,${req.body.t},${JSON.stringify(

        {

            "l":"IRAQ"
        }
    )}`);
    console.log(error);
}

        
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
//get components
router.post("/gc", async (req, res) => {

    const token = checkAuthority(req, [0]);
    console.log(token);

    try {
        if (token == null ) {

            res.send({
                e: 1
            })

        } else {
            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');

          
                res.send({
                    c:(await sql`select * from components`),
                    e: 0,
                })
            

            sql.end()


        }
    } catch (error) {
        console.log(error);
        res.send({ e: 1 })
    }

})
//get history
router.post("/gh", async (req, res) => {

    const token = checkAuthority(req, [0]);
    console.log(token);

    try {
        if (token == null ) {

            res.send({
                e: 1
            })

        } else {
            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');

          
                res.send({
                    r:(await sql`select requestid,date,request,username,type from requests inner join login on senderid=id where status=2`),
                    e: 0
                })
            

            sql.end()


        }
    } catch (error) {
        console.log(error);
        res.send({ e: 1 })
    }

})


//make new category
router.post("/uc", async (req, res) => {

    const token = checkAuthority(req, [0]);
    console.log(token);

    try {
        if (token == null || (typeof (req.body.cn) != 'string')) {

            res.send({
                e: 1
            })

        } else {

            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');

            if ((await sql`select * from categories where foodcategoryname=${req.body.cn}`).length > 0) {
                res.send({
                    e: 2 // category exists
                })


            } else {
                await sql`insert into categories (foodcategoryname) values(${req.body.cn})`
                res.send({
                    e: 0
                })
            }

            sql.end()


        }
    } catch (error) {
        console.log(error);
        res.send({ e: 1 })
    }

})



//update category
router.post("/uc", async (req, res) => {

    const token = checkAuthority(req, [0]);
    console.log(token);

    try {
        if (token == null || (typeof (req.body.cn) != 'string') || (typeof (req.body.ci) != 'number')) {

            res.send({
                e: 1
            })

        } else {

            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');

            if ((await sql`select * from categories where foodcategoryname=${req.body.cn}`).length > 0) {

                await sql`update categories set foodcategoryname =${req.body.fn} where foodcategoryid=${req.body.ci})`
                res.send({
                    e: 0 // category exists
                })
            } else {
                res.send({
                    e: 2 // category does not exists
                })

            }

            sql.end()


        }
    } catch (error) {
        console.log(error);
        res.send({ e: 1 })
    }

})

//get all requests
router.post("/grs", async (req, res) => {

    const token = checkAuthority(req, [0]);
    console.log(token);

    try {
        if (token == null) {

            res.send({
                e: 1
            })

        } else {

            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');

            res.send({
                e: 0,
                r: (await sql`select * from requests where status <2`)
            })


            sql.end()


        }
    } catch (error) {
        console.log(error);
        res.send({ e: 1 })
    }

})


//get all bills
router.post("/uc", async (req, res) => {

    const token = checkAuthority(req, [0]);
    console.log(token);

    try {
        if (token == null) {

            res.send({
                e: 1
            })

        } else {

            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');

            res.send({
                e: 0,
                b: (await sql`select * from billing`)
            })


            sql.end()


        }
    } catch (error) {
        console.log(error);
        res.send({ e: 1 })
    }

})



//add new bills
router.post("/uc", async (req, res) => {

    const token = checkAuthority(req, [0]);
    console.log(token);

    try {
        if (token == null || (typeof (req.body.bn) != 'string') || (typeof (req.body.bc) != 'number')) {

            res.send({
                e: 1
            })

        } else {

            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');
            (await sql`insert into billing (billtitle,bill,date) values(${req.body.bn},${req.body.bc},now())`);

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


//delete all existing bill
router.post("/rmb", async (req, res) => {

    const token = checkAuthority(req, [0]);
    console.log(token);

    try {
        if (token == null) {

            res.send({
                e: 1
            })

        } else {

            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');
            (await sql`delete from requests where status=2`);

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

//delete a food Item
router.post("/rmf", async (req, res) => {

    const token = checkAuthority(req, [0]);
    console.log(token);

    try {
        if (token == null || typeof(req.body.i)!='number') {

            res.send({
                e: 1
            })

        } else {

            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');
            (await sql`delete from favorites where foodid=${req.body.i}`);
            (await sql`delete from food where foodid=${req.body.i}`);

            try {
                await storage().bucket().file(req.body.i.toString()).delete();

            } catch (error) {
                
            }
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

//delete a component Item
router.post("/rmi", async (req, res) => {

    const token = checkAuthority(req, [0]);
    console.log(token);

    try {
        if (token == null || typeof(req.body.n)!='string') {

            res.send({
                e: 1
            })

        } else {

            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');
            (await sql`delete from components where name=${req.body.n}`);


        
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



//add new component
router.post("/anc", async (req, res) => {

    const token = checkAuthority(req, [0]);
    console.log(token);

    try {
        if (token == null || (typeof (req.body.cn) != 'string')) {

            res.send({
                e: 1
            })

        } else {

            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');

            if ((await sql`select * from components where name=${req.body.cn}`).length > 0) {
                res.sendStatus(404);


            } else {
                if(req.body.cu==undefined)
                req.body.cu="";
                await sql`insert into components (name,quantity,unit) values(${req.body.cn},${req.body.cq},${req.body.cu})`

                res.send({
                    e: 0
                })
            }

            sql.end()


        }
    } catch (error) {
        console.log(error);
        res.send({ e: 1 })
    }

})


//update component
router.post("/anc", async (req, res) => {

    const token = checkAuthority(req, [0]);
    console.log(token);

    try {
        if (token == null || (typeof (req.body.cn) != 'string') || (typeof (req.body.c) != 'number') || (typeof (req.body.cid) != 'number')) {

            res.send({
                e: 1
            })

        } else {

            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');

            if ((await sql`select * from rawfood where componentname=${req.body.cn}`).length < 1) {
                res.send({
                    e: 2 // component does not exists
                })


            } else {

                await sql`update rawfood set componentname=${req.body.cn},currentcount=${req.body.c} where componentid=${req.body.cid}`

                res.send({
                    e: 0
                })
            }

            sql.end()


        }
    } catch (error) {
        console.log(error);
        res.send({ e: 1 })
    }

})


//add new food
router.post("/nf", async (req, res) => {

    const token = checkAuthority(req, [0]);
    console.log(token);
    console.log(req.files.file);

    try {
        if (token == null || ( (req.body.n) ==undefined) || ( (req.body.p) == undefined) || ( (req.body.c) == undefined)|| ( (req.body.d) ==undefined)|| ( (req.body.ed) ==undefined)|| ( (req.body.en) ==undefined)) {
            console.log('not cool');
            res.send({
                e: 1
            })

        } else {

            const sql = postgres('postgres://resturant_vdcb_user:UtoT1CiJr4cgzT3ShwxjstDGSxoRdq1k@dpg-cgvmmq0dh87joksrkia0-a/resturant_vdcb');
  
try {
    

    (await sql`insert into food (foodname,price,categoryid,components) values(${req.body.n},${req.body.p},${req.body.c},${req.body.d})`);
    (await sql`insert into translations (arabic,english) values(${req.body.n},${req.body.en})`);
    (await sql`insert into translations (arabic,english) values(${req.body.d},${req.body.ed})`);
    const fileName=(await sql`select foodid from food where foodid=(select max(foodid) from food)`)[0].foodid;
    (await require('fs/promises').writeFile("./"+fileName,req.files.file.data));
    (await require('./server').app.app().storage().bucket().upload("./"+fileName));
    console.log(fileName);
   
    res.send({e:0})
} catch (error) {
    console.log(error);
    res.sendStatus(404);
}
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