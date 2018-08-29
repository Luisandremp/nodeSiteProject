const Sequelize = require('sequelize');
module.exports = {
    winningTeam: {
        type: Sequelize.INTEGER.UNSIGNED
    },
    timeElapsed: {
        type: Sequelize.INTEGER.UNSIGNED
    },
    dateOfTheGame: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
        }
    }