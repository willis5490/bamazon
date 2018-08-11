var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    port: 3307,

    user: "root",

    password: "Danny!@#321",
    database: "bamazon_bd"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    manager();

});

function manager() {
    inquirer.prompt([
        {
            name: "options",
            type: "checkbox",
            choices: ["View Products for sale", "View low Inventory", "Add to inventory", "Add new product", "Exit"],
            message: "What would you like to do?",
            default: "View Products for sale"
        }
    ]).then(function (answer) {
        var managerDecision = answer.options[0];
        if (managerDecision === "View Products for sale") {
            viewproducts();

        }
        else if (managerDecision === "View low Inventory") {
            lowInventory();
        }
        else if (managerDecision === "Add to inventory") {
            addInventory();
        }
        else if (managerDecision === "Add new product") {
            newProduct();
        }
        else if (managerDecision === "Exit") {
            connection.end();
        }
        else {
            console.log("You did not select a valid response, please try again!")
            setTimeout(manager, 3000, "mainpage");
        }

    })
};

function viewproducts() {
    connection.query("SELECT * FROM products", function (err, results) {
        var parse = JSON.parse(JSON.stringify(results));
        for (var i = 0; i < parse.length; i++) {
            console.log("\nID: " + parse[i].id);
            console.log("Product: " + parse[i].product);
            console.log("Department: " + parse[i].department);
            console.log("Price: " + parse[i].price);
            console.log("Quantity available: " + parse[i].quantity_available);
            console.log("***********************************\n")

        }
        console.log("These are all of your products");
        console.log("**************************");
        manager();
    })


};

function lowInventory() {
    connection.query("SELECT * FROM products WHERE quantity_available <= 5", function (err, results) {
        var parse = JSON.parse(JSON.stringify(results));
        for (var i = 0; i < parse.length; i++) {
            console.log("\nID: " + parse[i].id);
            console.log("Product: " + parse[i].product);
            console.log("Department: " + parse[i].department);
            console.log("Price: " + parse[i].price);
            console.log("Quantity available: " + parse[i].quantity_available);
            console.log("***********************************\n")
        }
        console.log("These products are running low!");
        console.log("**************************");
        manager();
    })


};

function addInventory() {

    connection.query("SELECT * FROM products", function (err, results) {
        var parse = JSON.parse(JSON.stringify(results));
        for (var i = 0; i < parse.length; i++) {
            console.log("\nID: " + parse[i].id);
            console.log("Product: " + parse[i].product);
            console.log("Department: " + parse[i].department);
            console.log("Price: " + parse[i].price);
            console.log("Quantity available: " + parse[i].quantity_available);
            console.log("***********************************")

        }

        inquirer.prompt([
            {
                name: "order",
                type: "input",
                message: "Select the product you would like to add by its product ID."
            }
        ]).then(function (answer) {
            if (answer.order > parse.length) {
                console.log("That is not a valid choice, try again.");
                setTimeout(showData, 3000, "mainpage");
            } else {
                var userpurchase = answer.order;
                connection.query("SELECT * FROM products HAVING id=?", [userpurchase], function (err, newdata) {
                    var choiceselected = JSON.parse(JSON.stringify(newdata));


                    inquirer.prompt([
                        {
                            name: "change",
                            type: "input",
                            message: "how many " + choiceselected[0].product + " would you like to add?"
                        }
                    ]).then(function (answer) {
                        var additem = answer.change;
                        console.log(userpurchase);
                        console.log(additem);
                        connection.query("UPDATE products SET quantity_available = quantity_available +? WHERE id =?", [additem, userpurchase], function (err, data) {
                            console.log("You have just added " + additem + " " + choiceselected[0].product);
                            manager();
                        })
                    })
                })

            }
        })
    });
};

function newProduct() {
    inquirer.prompt([
        {
            name: "prod",
            type: "input",
            message: "What is the name of the product you want to add?"
        }
    ])
        .then(function (answer) {
            var newprod = answer.prod;
            console.log(newprod);
            inquirer.prompt([
                {
                    name: "depart",
                    type: "input",
                    message: "What is the department of the product you want to add?"
                }
            ])
                .then(function (answer) {
                    var newpdepart = answer.depart;
                    console.log(newpdepart);
                    inquirer.prompt([
                        {
                            name: "price",
                            type: "input",
                            message: "What is the price of the product you want to add?"
                        }
                    ])
                        .then(function (answer) {
                            var newprice = answer.price;
                            console.log(newprice);

                            inquirer.prompt([
                                {
                                    name: "quan",
                                    type: "input",
                                    message: "What is the quantity of the new product you want to add?"
                                }
                            ])
                                .then(function (answer) {
                                    var newquan = answer.quan;
                                
                                    connection.query("INSERT INTO products (product,department,price,quantity_available) VALUES (?,?,?,?)", [newprod,newpdepart,newprice,newquan], function(err, data){
                                        console.log(data);
                                        manager();
                                    })
                                    
                                })
                        })
                })
        })


};