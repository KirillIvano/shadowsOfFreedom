var request = require("request");



const VkOperationsQuery = function () {

    let query = [];
    this.getQueryLen = function () {
        return query.length;
    };
    this.addOperationToQuery = function (operation, immediate) {
        if (operation.method !== undefined) {
            const operObj = {
                method: operation.method,
                args: operation.args
            };
            if (immediate){
                query.unshift(operObj);
            }else{
                query.push(operObj);
            }

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
const vkClass = function (type, access_token) {
    // all Vk methods , which are used by one account must me created with this class, it prevents from sending too many requests
    let timeout;

    // checks, what type of token we have 
    if (type === "client") {
        timeout = 1000 / 3;
    } else if (type === "community") {
        timeout = 1000 / 20;
    } else {
        timeout = 1000 / 3;
    }
    let onTimeout = false;
    let query = new VkOperationsQuery();

    // here we store all generated methods
    const methods = {};

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
    
    const createProcess = (options) => {
        // callback takes 3 arguments: error , request data and response 
        return (args, callback) => {
            return new Promise(function (resolve, reject) {
                if (!callback) {
                    callback = function (error, request, body) {
                        if (error){
                            console.log(error);
                        }
                    };
                }
                const newProcess = () => {
                    const newOptions = {...options, 
                                        form: {...options.form}};
                    for (let key in args) {
                        newOptions.form[key] = args[key];
                    }
                    request(newOptions, (error, response, body) => {
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
        };
    };

    this.clearQuery = function () {
        query.clearQuery();
    };

    this.createMethod = (method) => {
        let options = {
            url: "https://api.vk.com/method/" + method,
            method: "POST",
            qs: {
                v: 5.95,
                access_token: access_token
            },
            form: {
                
            },
        };
        // returns function, which needs arguments and the callback to usual request
        methods.method = method;
        return createProcess(options); 
    };
};


module.exports.vkClass = vkClass;
