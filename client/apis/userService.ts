import { hostDomain } from '@/.config/config'
import api from './api'

const handleSaveWorkingHours = (workingHours: any) => {
    return api.post('/api/schedule/update-working-hours', workingHours)
}

const handleFetchScheduleData = (date: any) => {
    return api.get(`/api/schedule/fetch-schedule-data?date=${date}`)
}
export {
    handleSaveWorkingHours,
    handleFetchScheduleData
}