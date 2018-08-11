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
    showData();

});



var showData = function () {
    connection.query("SELECT * FROM products", function (err, results) {
        var parse = JSON.parse(JSON.stringify(results));

        for (var i = 0; i < parse.length; i++) {
            console.log("\nID: " + parse[i].id);
            console.log("Product: " + parse[i].product);
            console.log("Price: " + parse[i].price + "\n");
            console.log("***********************************")

        }
        inquirer.prompt([
            {
                name: "order",
                type: "input",
                message: "Scroll through the items above and choose what item you would like to purchase, then input the products ID here."
            }
        ]).
            then(function (answer) {
                if(answer.order > parse.length){
                    console.log("That is not a valid choice, try again.");
                    setTimeout(showData, 3000, "mainpage");
                }else{
                var userpurchase = answer.order;
                connection.query("SELECT * FROM products HAVING id=?", [userpurchase], function (err, newdata) {
                    var choiceselected = JSON.parse(JSON.stringify(newdata));
                    inquirer.prompt([
                        {
                            name: "confirm",
                            type: "confirm",
                            message: " Are you sure you want to buy the product: \n" + choiceselected[0].product + ", which costs $" + choiceselected[0].price,
                            default: false
                        }
                    ]).then(function (answer) {
                        if (answer.confirm === true) {
                            inquirer.prompt([
                                {
                                    name:"quantity",
                                    type: "input",
                                    message: "How many " + choiceselected[0].product + "'s would you like to buy?"
                                }
                            ]).then(function(answer){
                                if(answer.quantity<=0){
                                    console.log("You cannot purchase a 0 quantity, you are being redirected to the homepage.");
                                    setTimeout(showData, 4000, "mainpage");
                                }else{
                                var whatsleft = choiceselected[0].quantity_available;
                                var userQuantity = answer.quantity;
                                var updatedstock = whatsleft - userQuantity;
                                var updatedQuantity = choiceselected[0].id;
                                if (userQuantity < whatsleft){
                                    connection.query("UPDATE products SET quantity_available =? Where id=? ",[updatedstock, updatedQuantity], function(err, updated){
                                        console.log("You have just purchased a:\n" + choiceselected[0].product + " for $" + choiceselected[0].price + "\nCome back soon!!");
                                        connection.end();
                                    })

                                }else{
                                    console.log("Sorry we dont have that many in stock, This is the quantity we have left: " + whatsleft);
                                    console.log("You will now be redirected to the main page");
                                    setTimeout(showData, 10000, "mainpage");
                                }
                            }
                            })
                        }
                        else {
                            console.log("You selected that you did not want to buy this product. You will now be redirected to the main page.");
                            setTimeout(showData, 5000, "mainpage");

                        }
                    })



                })
            }

            })

    })
};

