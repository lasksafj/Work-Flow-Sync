const scheduleService = require('../services/scheduleService')

const getUserData = async (req, res) => {
    let response = await scheduleService.getUserData(req.user.id)
}

module.exports = {
    getUserData
}