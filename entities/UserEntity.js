const Sequelize = require('sequelize');
module.exports = {    
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        validate: { 
            isEmail: true
        }
    },
    password: {
        type: Sequelize.TEXT
        },
}
