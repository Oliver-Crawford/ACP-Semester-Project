var express = require('express');
var app = express();
var mysql = require('mysql');
var util = require('util');
var cors = require('cors');
app.use(express.json());
var dbName = "OliverSemesterProjectDb";
var tableProducts = `${dbName}.products`;
var tableStaff = `${dbName}.staff`;
var tableOrders = `${dbName}.orders`;
var tableOrderItems = `${dbName}.orderitems`;

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your allowed origin
    methods: ['GET', 'POST'], // Specify which HTTP methods are allowed
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    optionsSuccessStatus: 200 // Some legacy browsers (IE11) choke on 204
};

app.use(cors(corsOptions));

const setHeadersMiddleware = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
};
app.use(setHeadersMiddleware);

var con = mysql.createConnection({
    host: "localhost",
    user: "root",   
    port: 3306,
    password: "",
    database: `${dbName}`

});



const query = util.promisify(con.query).bind(con);

con.connect((err) =>{
    if (err) throw err;
    console.log("Connected!");
});


app.get('/', (req, res) =>{
    res.sendFile(__dirname + '\\files\\index.html', );
});

app.post('/PostProducts', (req, res) =>{
    const insertQuery = `insert into ${tableProducts} (name, description, price, image, amount) values ('${req.body.name}', '${req.body.description}', ${req.body.price}, '${req.body.image}', ${req.body.amount});`;
    con.query(insertQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.get('/GetAllProducts', (req, res) =>{
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    const selectQuery = `select * from ${tableProducts};`;
    con.query(selectQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.get('/GetProductById/:id', async (req, res) =>{
    if(!testId(req.params.id)){
        res.send(`Must include an id, ${req.params.id} is not an id.`);
        return 0;
    }
    var id = parseInt(req.params.id);
    try{
        const data = await selectByIdQuery(tableProducts, id);
        res.send(data);
    }catch(e){
        res.status(500).send("Error");
    }
});

app.post('/PatchProducts', (req, res) =>{
    if(!testId(req.body.id)){
        res.send(`Must include an id, ${req.body.id} is not an id.`);
        return 0;
    }
    var updateQuery = `update ${tableProducts} set `;
    var idValue = parseInt(req.body.id);
    var updated = false;
    if(req.body.name != null){
        updateQuery += `name = '${req.body.name}'`;
        updated = true;
    }
    if(req.body.description != null){
        if(updated) updateQuery += ", ";
        updateQuery += `description = '${req.body.description}'`;
        updated = true;
    }
    if(req.body.price != null && !isNaN(parseFloat(req.body.price))){
        if(updated) updateQuery += ", ";
        updateQuery += `price = ${req.body.price}`;
        updated = true;
    }
    if(req.body.image != null){
        if(updated) updateQuery += ", ";
        updateQuery += `image = '${req.body.image}'`;
        updated = true;
    }
    if(req.body.amount != null && !isNaN(parseInt(req.body.amount))){
        if(updated) updateQuery += ", ";
        updateQuery += `amount = ${req.body.amount}`;
        updated = true;
    }
    if(!updated){
        res.send("Must update a field");
        return 0;
    }
    updateQuery += ` where id = ${idValue};`;
    con.query(updateQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.get('/DeleteProducts/:id', (req, res) =>{
    if(!testId(req.params.id)){
        res.send(`Must include an id, ${req.params.id} is not an id.`);
        return 0;
    }
    const deleteQuery = `delete from ${tableProducts} where id = ${req.params.id};`;
    con.query(deleteQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.post('/PostStaff', (req, res) =>{
    const insertQuery = `insert into ${tableStaff} (name, role, managerId, active) values ('${req.body.name}', ${req.body.role}, ${req.body.managerId}, ${req.body.active});`;
    con.query(insertQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.get('/GetAllStaff', (req, res) =>{
    const selectQuery = `select * from ${tableStaff};`;
    con.query(selectQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.get('/GetStaffById/:id', async(req, res) =>{
    if(!testId(req.params.id)){
        res.send(`Must include an id, ${req.params.id} is not an id.`);
        return 0;
    }
    var id = parseInt(req.params.id);
    try{
        const data = await selectByIdQuery(tableStaff, id);
        res.send(data);
    }catch(e){
        res.status(500).send("Error");
    }
});

app.post('/PatchStaff', (req, res) =>{
    if(!testId(req.body.id)){
        res.send(`Must include an id, ${req.body.id} is not an id.`);
        return 0;
    }
    var updateQuery = `update ${tableStaff} set `;
    var idValue = parseInt(req.body.id);
    var updated = false;
    const boolRegex = new RegExp('true|false|1|0');

    if(req.body.name != null){
        updateQuery += `name = '${req.body.name}'`;
        updated = true;
    }

    if(req.body.role != null && !isNaN(parseInt(req.body.role))){
        if(updated) updateQuery += ", ";
        updateQuery += `role = ${req.body.role}`;
        updated = true;
    }

    if(req.body.managerId != null && !isNaN(parseInt(req.body.managerId))){
        if(updated) updateQuery += ", ";
        updateQuery += `managerId = ${req.body.managerId}`;
        updated = true;
    }

    if(boolRegex.test(req.body.active)){
        if(updated) updateQuery += ", ";
        updateQuery += `active = ${req.body.active}`;
        updated = true;
    }

    if(!updated){
        res.send("Must update a field");
        return 0;
    }
    updateQuery += ` where id = ${idValue};`;
    con.query(updateQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.get('/DeleteStaff/:id', (req, res) =>{
    if(!testId(req.params.id)){
        res.send(`Must include an id, ${req.params.id} is not an id.`);
        return 0;
    }
    const deleteQuery = `delete from ${tableStaff} where id = ${req.params.id};`;
    con.query(deleteQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.post('/PostOrders', (req, res) =>{
    const insertQuery = `insert into ${tableOrders} (total) values (${req.body.total});`;
    con.query(insertQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.get('/GetAllOrders', (req, res) =>{
    const selectQuery = `select * from ${tableOrders};`;
    con.query(selectQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.get('/GetOrdersById/:id', async (req, res) =>{
    if(!testId(req.params.id)){
        res.send(`Must include an id, ${req.params.id} is not an id.`);
        return 0;
    }
    var id = parseInt(req.params.id);
    try{
        const data = await selectByIdQuery(tableOrders, id);
        res.send(data);
    }catch(e){
        res.status(500).send("Error");
    }
});

app.post('/PatchOrders', (req, res) =>{
    if(!testId(req.body.id)){
        res.send(`Must include an id, ${req.body.id} is not an id.`);
        return 0;
    }
    var updateQuery = `update ${tableOrders} set `;
    var idValue = parseInt(req.body.id);
    var updated = false;

    if(req.body.total != null){
        updateQuery += `total = ${req.body.total}`;
        updated = true;
    }

    if(!updated){
        res.send("Must update a field");
        return 0;
    }
    updateQuery += ` where id = ${idValue};`;
    con.query(updateQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.get('/DeleteOrders/:id', (req, res) =>{
    if(!testId(req.params.id)){
        res.send(`Must include an id, ${req.params.id} is not an id.`);
        return 0;
    }
    const deleteQuery = `delete from ${tableOrders} where id = ${req.params.id};`;
    con.query(deleteQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.post('/PostOrderItems', (req, res) =>{
    const insertQuery = `insert into ${tableOrderItems} (itemId, amount, orderId) values (${req.body.itemId}, ${req.body.amount}, ${req.body.orderId});`;
    con.query(insertQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.get('/GetAllOrderItems', (req, res) =>{
    const selectQuery = `select * from ${tableOrderItems};`;
    con.query(selectQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.get('/GetOrderItemsById/:id', async (req, res) =>{
    if(!testId(req.params.id)){
        res.send(`Must include an id, ${req.params.id} is not an id.`);
        return 0;
    }
    var id = parseInt(req.params.id);
    try{
        const data = await selectByIdQuery(tableOrderItems, id);
        res.send(data);
    }catch(e){
        res.status(500).send("Error");
    }
});

app.post('/PatchOrderItems', (req, res) =>{
    if(!testId(req.body.id)){
        res.send(`Must include an id, ${req.body.id} is not an id.`);
        return 0;
    }

    var updateQuery = `update ${tableOrderItems} set `;
    var idValue = parseInt(req.body.id);
    var updated = false;

    if(req.body.itemId != null && !isNaN(parseInt(req.body.itemId))){
        updateQuery += `itemId = '${req.body.itemId}'`;
        updated = true;
    }

    if(req.body.amount != null && !isNaN(parseInt(req.body.amount))){
        if(updated) updateQuery += ", ";
        updateQuery += `amount = ${req.body.amount}`;
        updated = true;
    }

    if(req.body.orderId != null && !isNaN(parseInt(req.body.orderId))){
        if(updated) updateQuery += ", ";
        updateQuery += `amount = ${req.body.orderId}`;
        updated = true;
    }

    if(!updated){
        res.send("Must update a field");
        return 0;
    }
    updateQuery += ` where id = ${idValue};`;
    con.query(updateQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.get('/DeleteOrderItems/:id', (req, res) =>{
    if(!testId(req.params.id)){
        res.send(`Must include an id, ${req.params.id} is not an id.`);
        return 0;
    }
    const deleteQuery = `delete from ${tableOrderItems} where id = ${req.params.id};`;
    con.query(deleteQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.get('/QuickDbDropCreate', (req, res) =>{
    const dropQuery = `drop database ${dbName}`;
    const createQuery = `create database ${dbName}`;
    con.query(dropQuery, (err, result) =>{
        if(err) throw err;
        con.query(createQuery, (err, result) =>{
            if(err) throw err;
            res.send(result);
        })
    })
})

async function selectByIdQuery(tableName, id){
    const selectQuery = `select * from ${tableName} where id=${id};`;
    try{
        const rows = await query(selectQuery);
        return rows;
    }catch(e){
        throw e;
    }
    /*
    con.query(selectQuery, (err, result) =>{
        if(err) throw err;
        var out = new Promise((resolve, reject) =>{
            setTimeout(() =>{
                var data = result;
                resolve(data);
            }, 2000);
        });
        return out;
    });
    */
    
}

async function testId(id){
    if(id == null || isNaN(parseInt(id))){
        return false
    }
    return true;
}
var server = app.listen(8080, () =>{
    /*
    products
    id int not null primary key AUTO_INCREMENT
    name nvarchar(255) not null
    description nvarchar(255) not null
    price decimal(10, 2) not null
    image nvarchar(65535) not null
    amount int not null

    staff
    id int not null primary key auto_increment
    name nvarchar(255) not null
    role int not null
    managerId int not null
    active bool not null
    foreign key(managerId) references ${tableStaff}(id)
    
    orders
    id int not null primary key auto_increment
    total decimal(10, 2) not null

    orderItems
    id int not null primary key auto_increment
    itemId int not null
    amount int not null
    orderId int not null
    foreign key(orderId) references ${tableOrders}(id)
    foreign key(itemId) references ${tableProducts}(id)
    */

    var createDbQuery = `CREATE DATABASE IF NOT EXISTS  ${dbName};`;

    var createProductsTableQuery = `CREATE TABLE IF NOT EXISTS ${tableProducts} (id int not null primary key AUTO_INCREMENT, name nvarchar(255) not null, description nvarchar(255) not null, price decimal(10, 2) not null, image nvarchar(65535) not null, amount int not null);`;
    var checkProductsTableQuery = `SELECT * from ${tableProducts};`;
    var populateProductsTableQueryTemplate = `INSERT INTO ${tableProducts} (name, description, price, image, amount) VALUES ('`;
    var productsDefaults = require(__dirname+"\\files\\productsDefaults.json");

    var createStaffTableQuery = `create table if not exists ${tableStaff} (id int not null primary key auto_increment, name nvarchar(255) not null, role int not null, managerId int not null, active bool not null, foreign key(managerId) references ${tableStaff}(id));`;
    var checkStaffTableQuery = `select * from ${tableStaff};`;
    var populateStaffTableQueryTemplate = `insert into ${tableStaff} (name, role, managerId, active) values ('`;
    var staffDefaults = require(__dirname+"\\files\\staffDefaults.json");

    var createOrdersTableQuery = `create table if not exists ${tableOrders} (id int not null primary key auto_increment, total decimal(10, 2) not null);`;
    var checkOrdersTableQuery = `select * from ${tableOrders};`;
    var populateOrdersTableQueryTemplate = `insert into ${tableOrders} (total) values (`;
    var ordersDefault = require(__dirname+"\\files\\ordersDefaults.json");

    var createOrderItemsTableQuery = `create table if not exists ${tableOrderItems} (id int not null primary key auto_increment, itemId int not null, amount int not null, orderId int not null, foreign key(orderId) references ${tableOrders}(id), foreign key(itemId) references ${tableProducts}(id));`;
    var checkOrderItemsTableQuery = `select * from ${tableOrderItems}`;
    var populateOrderItemsTableQueryTemplate = `insert into ${tableOrderItems} (itemId, amount, orderId) values (`;
    var orderItemsDefault = require(__dirname+"\\files\\orderItemsDefaults.json");

    console.log('Node server booting up\ndoing initial configs/checks');
    con.query(createDbQuery, (err, result)=>{
        if(err) throw err;
        console.log("DB Exists!");
        con.query(createProductsTableQuery, (err, result) =>{
            if(err) throw err;
            console.log(`${tableProducts} Exists!`);
            con.query(checkProductsTableQuery, (err, result) =>{
                if(err) throw err;
                if(result.length == 0){
                    productsDefaults.defaultRows.forEach((item) => {
                        var populateProductsTableQuery = populateProductsTableQueryTemplate +  item.name + "', '" + item.description + "', " + item.price + ", '" + item.image + "', " + item.amount + ");";
                        con.query(populateProductsTableQuery, (err, result) =>{
                            if(err) throw err;
                            console.log(`Created the ${item.name} row in ${tableProducts}!`);
                        });
                    });
                } else {
                    console.log(`Rows already existed in ${tableProducts}`);
                }
            });
        });

        con.query(createStaffTableQuery, (err, result) =>{
            if(err) throw err;
            console.log(`${tableStaff} Exists!`);
            con.query(checkStaffTableQuery, (err, result) =>{
                if(err) throw err;
                if(result.length == 0){
                    staffDefaults.defaultRows.forEach((item) => {
                        var populateStaffTableQuery = populateStaffTableQueryTemplate +  item.name + "', " + item.role + ", " + item.managerId + ", " + item.active + ");";
                        con.query(populateStaffTableQuery, (err, result) =>{
                            if(err) throw err;
                            console.log(`Created the ${item.name} row in ${tableStaff}!`);
                        });
                    });
                } else {
                    console.log(`Rows already existed in ${tableStaff}`);
                }
            });
        });

        con.query(createOrdersTableQuery, (err, result) =>{
            if(err) throw err;
            console.log(`${tableOrders} Exists!`);
            con.query(checkOrdersTableQuery, (err, result) =>{
                if(err) throw err;
                if(result.length == 0){
                    ordersDefault.defaultRows.forEach((item) => {
                        var populateOrdersTableQuery = populateOrdersTableQueryTemplate + item.total + ");";
                        con.query(populateOrdersTableQuery, (err, result) =>{
                            if(err) throw err;
                            console.log(`Created the a new row in ${tableOrders}!`);
                        });
                    });
                } else {
                    console.log(`Rows already existed in ${tableOrders}`);
                }
            });
        });

        con.query(createOrderItemsTableQuery, (err, result) =>{
            if(err) throw err;
            console.log(`${tableOrderItems} Exists!`);
            con.query(checkOrderItemsTableQuery, (err, result) =>{
                if(err) throw err;
                if(result.length == 0){
                    orderItemsDefault.defaultRows.forEach((item) => {
                        var populateOrderItemsTableQuery = populateOrderItemsTableQueryTemplate + item.itemId + ", " + item.amount + ", " + item.orderId + ");";
                        con.query(populateOrderItemsTableQuery, (err, result) =>{
                            if(err) throw err;
                            console.log(`Created the a new row in ${tableOrderItems}!`);
                        });
                    });
                } else {
                    console.log(`Rows already existed in ${tableOrderItems}`);
                }
            });
        });

    });
});