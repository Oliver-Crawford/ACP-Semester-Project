var express = require('express');
var app = express();
var mysql = require('mysql');
app.use(express.json());
var dbName = "OliverSemesterProjectDb";
var tableProducts = `${dbName}.products`;
var tableStaff = `${dbName}.staff`;
var tableOrders = `${dbName}.orders`;
var tableOrderItems = `${dbName}.orderitems`;

var con = mysql.createConnection({
    host: "localhost",
    user: "root",   
    port: 3306,
    password: ""
});

con.connect((err) =>{
    if (err) throw err;
    console.log("Connected!");
});


app.get('/', (req, res) =>{
    res.sendFile(__dirname + '\\files\\index.html', );
});

app.get('/PostProducts', (req, res) =>{
    const insertQuery = `insert into ${tableProducts} (name, description, price, image, amount) values ('${req.body.name}', '${req.body.description}', ${req.body.price}, '${req.body.image}', ${req.body.amount});`;
    con.query(insertQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.get('/GetAllProducts', (req, res) =>{
    const selectQuery = `select * from ${tableProducts};`;
    con.query(selectQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.get('/GetProductById/:id', (req, res) =>{
    if(!testId(req.params.id)){
        res.send(`Must include an id, ${req.params.id} is not an id.`);
        return 0;
    }
    var id = parseInt(req.params.id);
    const selectQuery = `select * from ${tableProducts} where id=${id};`;
    con.query(selectQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });

    
});

app.get('/PatchProducts', (req, res) =>{
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

app.get('/PostStaff', (req, res) =>{
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

app.get('/GetStaffById/:id', (req, res) =>{
    if(!testId(req.params.id)){
        res.send(`Must include an id, ${req.params.id} is not an id.`);
        return 0;
    }
    var id = parseInt(req.params.id);
    const selectQuery = `select * from ${tableStaff} where id=${id};`;
    con.query(selectQuery, (err, result) =>{
        if(err) throw err;
        res.send(result);
    });

    
});

app.get('/PatchStaff', (req, res) =>{
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

function testId(id){
    if(id == null || isNaN(parseInt(id))){
        return false;
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