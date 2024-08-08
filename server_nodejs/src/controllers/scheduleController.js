const scheduleService = require('../services/scheduleService')

const getUserData = async (req, res) => {
    let response = await scheduleService.getUserData(req.user.id)
}


const updateSchedule = async (req, res) => {
    try{
        // if (req.body && req.user.id){
        //     let data = await scheduleService.handleUpdateSchedule(req.user.id, req.body, 'ABC')
        //     return res.status(200).json({
        //         EM: data.EM,
        //         EC: data.EC,
        //         ED: data.DT
        //     })
        // }else{
        //     return res.status(401).json({
        //         EM: 'error from updateSchedule',
        //         EC: -2,
        //         ED: ''
        //     })
        // }

        const {workingData, orgAbbr} = req.body;
        let data = await scheduleService.handleUpdateSchedule(req.user.id, req.body, orgAbbr);
        res.status(201).json({
            EM: data.EM,
            EC: data.EC,
            ED: ''
        })
        
    }catch(e){
        res.status(500).json({
            EM: e,
            EC: -1,
            ED: ""
        })
    }
    // 
    
}

const getAllScheduleData = async (req, res) => {
    try{
        // const {date} = req.query.date
       
        const {orgAbbr} = req.body
        let data = await scheduleService.handleFetchAllSchedule(req.query.date, orgAbbr)
        
        res.status(201).json({
            EM: data.EM,
            EC: data.EC,
            ED: data.ED
        })
    }catch(e){
        res.status(500).json({
            EM: e,
            EC: -1,
            ED: ""
        })
    }
}

module.exports = {
    getUserData,
    updateSchedule,
    getAllScheduleData
}