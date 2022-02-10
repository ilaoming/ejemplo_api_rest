const express = require('express');
const router = express.Router();
const pool = require('../mysql');
const cors = require('cors')
app.use(cors());
app.options('*', cors());

//GET methods
// -------------------------------------------------------------------------------------------------------------------------------------

// GET all products
router.get('/api/product',(req,res)=>{
    pool.getConnection(function(err,connection){
        if(err) throw err; // Not connected!

        // Query SQL
        const query = `
        SELECT * FROM 
        product
        `

        // Use connection
        connection.query(query,function (error,results,fields) { 

            // When done with the connection, release it.
            connection.release();

            // Handle error after the release.
            if (error) throw error;

            res.json(results);
         })

    })
    
});

// -------------------------------------------------------------------------------------------------------------------------------------


// GET products by id
router.get('/api/product/:id',(req,res)=>{
    pool.getConnection(function(err,connection){
        if(err) throw err; //Not connected!

        const id = req.params.id

        // Query SQL
        const query = `
        SELECT * FROM 
        product
        WHERE 
        id = ${connection.escape(id)}
        `

        // Use connection
        connection.query(query,function (error,results,fields) { 

            // When done with the connection, release it.
            connection.release();

            // Handle error after the release.
            if (error) throw error;

            // Validations
            if (results.length > 0) {
                res.status(200)
                res.json(results[0]);
            } else {
                res.status(404)
                res.send({
                    errors:[
                        `Product ${id} not found`
                    ]
                }) 
            }

         })

    })
    
});

// -------------------------------------------------------------------------------------------------------------------------------------


// GET products by category
router.get('/api/product/category/:category_id',(req,res)=>{
    pool.getConnection(function(err,connection){
        if(err) throw err; //Not connected!

        const id = req.params.category_id

        // Query SQL
        const query = `
        SELECT * FROM 
        product
        WHERE 
        category_id = ${connection.escape(id)}
        `

        // Use connection
        connection.query(query,function (error,results,fields) { 

            // When done with the connection, release it.
            connection.release();

            // Handle error after the release.
            if (error) throw error;

            // Validations
            if (results.length > 0) {
                res.status(200)
                res.json(results);
            } else {
                res.status(404)
                res.send({
                    errors:[
                        `Category ${id} not found`
                    ]
                }) 
            }

         })

    })
    
});

//POST methods
// -------------------------------------------------------------------------------------------------------------------------------------

// POST Add new product
const _post = {
    origin: true,
    methods: ["POST"],
    credentials: true,
    maxAge: 3600
  };

router.options("/add/product/", cors(_post));
router.post('/add/product/',cors(_post),(req,res)=>{
    pool.getConnection(function(err,connection){

        const URL_ = req.body.url;
        const name = req.body.name;
        const description = req.body.description;
        const price = req.body.price;
        const picture = req.body.picture;
        const available = req.body.available;
        const category_id = req.body.category_id;

        if(err) throw err; // Not connected!

        // Query SQL
        const query = `
            INSERT INTO
            product
            (
            name,
            description,
            price,
            picture,
            available,
            category_id
            ) VALUES 
            (
            ${connection.escape(name)},
            ${connection.escape(description)},
            ${connection.escape(price)},
            ${connection.escape(picture)},
            ${connection.escape(available)},
            ${connection.escape(category_id)}
            )`;

            if (name == "" || description == "" || price == "" || picture == "" || available == "" || category_id == "") {
                res.send({
                    errors: [`There are empty fields`],
                  });
            } else {
                // Use connection
                connection.query(query,function (error,results,fields) { 

                // When done with the connection, release it.
                connection.release();

                // Handle error after the release.
                if (error) throw error;
                
                // Redirect to actual URL
                res.status(200);
                res.redirect(URL_);

                });
        }
    })
    
});

//PUT methods
// -------------------------------------------------------------------------------------------------------------------------------------

// PUT update product
const _put = {
    origin: true,
    methods: ["POST"],
    credentials: true,
    maxAge: 3600
  };

router.options('/api/put/product/:id', cors(_put));
router.put('/api/put/product/:id',cors(_put),(req,res)=>{
    pool.getConnection(function(err,connection){

        const name = req.body.name;
        const description = req.body.description;
        const price = req.body.price;
        const picture = req.body.picture;
        const category_id = req.body.category_id;

        if(err) throw err; // Not connected!

        // Query SQL
        const query = `
            UPDATE
            product
            SET
            name= ${connection.escape(name)},
            description= ${connection.escape(description)},
            price= ${connection.escape(price)},
            picture= ${connection.escape(picture)},
            category_id= ${connection.escape(category_id)}
            `;

            if (name == "" || description == "" || price == "" || picture == "" || category_id == "") {
                res.send({
                    errors: [`There are empty fields`],
                  });
            } else {
                // Use connection
                connection.query(query,function (error,results,fields) { 

                // When done with the connection, release it.
                connection.release();

                // Handle error after the release.
                if (error) throw error;
                
                // Redirect to actual URL
                res.status(200);
                res.send('Success')

                });
        }
    })
    
});


//DELETE methods
// -------------------------------------------------------------------------------------------------------------------------------------

// DELETE delete product


router.put('/api/put/product/:id',(req,res)=>{
    pool.getConnection(function(err,connection){

        const id = req.params.id;

        if(err) throw err; // Not connected!

        // Query SQL
        const query = `
            SELECT
            *
            FROM
            product
            WHERE id= ${connection.escape(id)}
            `;

        connection.query(query,function (error,results,fields) { 
         // When done with the connection, release it.
         connection.release();

        // Handle error after the release.
        if (error) throw error;

        if (results.length > 0) {
            const query_delete = `
            DELETE
            FROM
            product
            WHERE id= ${connection.escape(id)}
            `
            // Use connection
            connection.query(query,function (error,results,fields) { 
        
            // When done with the connection, release it.
            connection.release();
        
            // Handle error after the release.
            if (error) throw error;
            
            // Redirect to actual URL
            res.status(200);
            res.send('Success')
        
            });
        } else {
            res.status(404);
            res.send({
              errors: [`Product not found  : ${id}`],
            });
        }

        });
        


    })
    
});





module.exports = router