const Sequelize = require('sequelize');
module.exports ={
    team: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    playersKilled: {
        type: Sequelize.INTEGER,
            defaultValue: 0
        },
    deaths: {
    type: Sequelize.INTEGER,
        defaultValue: 0
    },
    minionsKilled: {
    type: Sequelize.INTEGER,
        defaultValue: 0
    },
    towerContribution: {
    type: Sequelize.INTEGER,
        defaultValue: 0
    },
    timePlayed: {
    type: Sequelize.INTEGER,
        defaultValue: 0
    },
    quitBeforeEndGame: {
        type: Sequelize.BOOLEAN,
            defaultValue: false
        }
}