const adminModel = require('./../models').model('Admin');

const createAdminFinder = function(){
    const users = {};
    const addToCache = (value)=> users[value.id] = value;
    const removeFromCache = (id)=> delete users[id];
    const getFromCache = (id) => users[id];
    const getFromDataBase = async (id) => await adminModel.findOne({id: id});
    const addToDataBase = (value) => {
        const admin = new adminModel();
        Object.keys(value).forEach((key)=>admin[key] = value[key]);
        return admin.save();
    };

    return {

        // add: async (value)=>{
        //     const cached = getFromCache(value.id);
        //     if (!cached){
        //         addToDataBase(value.id);
        //     }else{
        //         console.log('user exists');
        //     }
        // },
        get: async (id)=>{
            const cacheResult = getFromCache(id);
            if (!cacheResult){
                await addToDataBase({
                    "state": "init",
                    "log": "",
                    "id": 55409958
                });
                const doc = await getFromDataBase(id);
                if(!doc){
                    return;
                }
                addToCache(doc);
                return doc;
            }
            return cacheResult;
        },

    };
};


module.exports = createAdminFinder;

