var request = require("request");

const VkOperationsQuery = function () {

    let query = [];
    this.getQueryLen = function () {
        return query.length;
    };
    this.addOperationToQuery = function (operation) {
        if (operation.method !== undefined) {
            query.push({
                method: operation.method,
                args: operation.args
            });

        } else {
            console.log("no required params");
        }
    };

    this.getNextOperation = function () {
        return query.shift();
    };

    this.removeOperationById = function (id) {
        let ind;
        const len = query.length;
        for (ind=0;ind<len;ind++){
            if (query[ind].id == id) {
                query.splice(ind, 1);
            };
        }
    };

    this.clearQuery = function () {
        query = [];
    };

    this.isEmpty = function () {
        return (!query.length);
    };


};


// each class instance must be created with it's own VK account
// to use VK methods create an instance of this function with "new" then use method method Function to get vk methods
// every VK operation
// must have VkOperationsQuery.js file in the same directory 
var vkClass = function (type, access_token) {
    // all Vk methods , which are used by one account must me created with this class, it prevents from sending too many requests
    let timeout;

    // checks, what type of token we have 
    if (type === "cli") {
        timeout = 1000 / 3;
    } else if (type === "com") {
        timeout = 1000 / 20;
    } else {
        timeout = 1000 / 3;
    }
    let onTimeout = false;
    let query = new VkOperationsQuery();

    // here we store all generated methods
    let methods = {};

    // continues the chain of query getting
    const chainMaker = function () {
        // sets next operation if there is one in the query
        if (query.isEmpty()) {
            onTimeout = false;
        } else {
            operation = query.getNextOperation();
            operation.method(operation.args);
            setTimeout(chainMaker, timeout);
        }
    };

    this.clearQuery = function () {
        query.clearQuery();
    };


    this.methodFunction = (method) => {

        // returns function, which needs arguments and the callback to usual request
        methods.method = method;

        // we preset all required options , but specific data 
        let options = {
            url: "https://api.vk.com/method/" + method,
            method: "POST",
            qs: {
                v: 5.52,
                access_token: access_token
            },
        };

        // then return function, which we call to execute the method 
        // callback takes 3 arguments: error , request data and response body
        return (args, callback) => {
            let promiseToBeReturned;
            promiseToBeReturned = new Promise(function (resolve, reject) {
                if (callback === undefined) {
                    callback = function (error, request, body) {
                        if (error){
                            throw new Error(error);
                        }
                    };
                }
                const newProcess = () => {
                    const body = {};
                    for (key in args) {
                        options.qs[key] = args[key];
                    }
                    console.log(options);
                    // console.log(args);
                    // options.body = JSON.stringify(args);
                    request(options, (error, response, body) => {
                        callback(error, response, body);
                        if (error) {
                            reject(error);
                        } else {
                            resolve(body);
                        }
                    });

                };

                if (!onTimeout) {
                    newProcess();
                    onTimeout = true;
                    setTimeout(chainMaker, timeout);

                } else {
                    query.addOperationToQuery({
                        method: newProcess,
                    });
                }
            });

            return promiseToBeReturned;
        };
    };
};


module.exports.vkClass = vkClass;
