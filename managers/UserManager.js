module.exports ={
    Repository: require("../repository/Repository.js"),
    bcrypt: require('bcrypt'),
    sanitizeUser: require('./sanitizeUser.js'),
    saltRounds: 10,
    
    constructor() {
        this.Repository.constructor();
    },

    getUserOrCreate:  async function(user){
        try {
            const result = await this.getUserByEmail(user.email);
            if(result.success){
                return { success: true, 'user': result.user};
            }else{
                const insertResult = await this.insertUser(user);
                if(insertResult.success){ 
                    return { success: true, 'user': insertResult.user};
                }else{
                    return [{success: false, 
                        msg: "Error Creating new user" }];
                }

            }    
        } catch (err) {
            return [{success: false, 
                msg: err
                }];
        }
    },

    

    loginUser: async function(loginfo){
        try {
            const user = await this.Repository.getUserByEmail(loginfo.email)
            let match;
            if(user!= null){
                match = await this.bcrypt.compare(loginfo.password, user.password);
                if(match){
                    return { success: true, 'user': user};
                }else{
                    return [{success: false, location: 'body',
                    param: 'password',
                    msg: "Email or Password incorrect.",
                    value: loginfo.password }];
                }
            }else{
                return [{success: false, location: 'body',
                param: 'password',
                msg: "This Email isnt registered yet!",
                value: loginfo.password }];
            } 
            

        } catch (err) {
            return [{success: false, location: 'body',
            msg: err
                }];
        }
    },

    getUserByEmail: async function(email){
        try {
            const user = await this.Repository.getUserByEmail(email);        
            if(user != null){
                return { success: true, 'user': user};
            }else{
                return [{success: false, 
                    msg: "User "+email+" doesn't exist." }];
            }

        } catch (err) {
            return [{success: false, 
                msg: err
                }];
        }
    },

    getUserByID: async function(id){
        try {
            user = await this.Repository.getUserByID(id);
            return { success: true, 'user': user};
        } catch (err) {
            return [{success: false, location: 'body',
                msg: err
            }];
        }
    },

    deleteUser: async function(id){
    try {
        return await this.Repository.deleteUser(id);
    } catch (err) {
        return [{success: false, location: 'body',
                msg: err
            }];
        }
    },

    insertUser: async function(userJson){
    try {
        if (userJson.password) {
            userJson.password = await this.bcrypt.hash(userJson.password, this.saltRounds);  
        }
        userJson.admin = false;
        const user = await this.Repository.insertUser(userJson);
        if (user != null) {
            return { success: true, 'user': user};
        }else{
            return [{success: false,
                msg: "Error managing user data. "+err
                }]; 
        }
        
    } catch (err) {
        return [{success: false,
        msg: "Error managing user data. "+err
        }];
    }
    },

    modifyUser: async function(userJson, id){
    try {
        return await this.Repository.modifyUser(userJson, id);
    } catch (err) {
        return [{success: false, location: 'body',
                msg: err
            }];
        }
    },
    changePassword: async function(userJson, id){
        
        try {

            const result = await this.getUserByID(id);
            const match = await this.bcrypt.compare(userJson.oldPassword, result.user.password);
            if (result.user.password == null || match ) {
                if (userJson.newPassword === userJson.confirmPassword) {
                    user.password = await this.bcrypt.hash(userJson.password, this.saltRounds);
                    return await this.Repository.modifyUser(userJson, id);
                }
            }else{
                [{success: false, location: 'body',
                    msg: "Invalid password"
                }];
            }
         
        } catch (err) {
            return [{success: false, location: 'body',
                    msg: err
                }];
            }
},

    getUsers: async function(){
    try {
        const listUsers = await this.Repository.getUsers();
        const listUsersSanitized = {} 
        for (const key in listUsers) {
            if (listUsers.hasOwnProperty(key)) {
                let user = listUsers[key];
                listUsersSanitized[key] = this.sanitizeUser( user );
            }
        }
        return listUsersSanitized;
    } catch (err) {
        return [{success: false, location: 'body',
                msg: err
            }];
        }
    }
}