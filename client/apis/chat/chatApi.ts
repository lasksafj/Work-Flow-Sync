import api from "../api";

const getGroupsApi = async () => {
    try {
        let response = await api.get(
            '/api/chat/get-groups',
        );
        return Promise.resolve(response.data);
    }
    catch (err: any) {
        return Promise.reject(err)
    }
}

const addGroupApi = async (groupName: string) => {
    try {
        let response = await api.post(
            '/api/chat/add-group',
            {
                groupName: groupName
            }
        );
        return Promise.resolve(response.data);
    }
    catch (err: any) {
        return Promise.reject(err)
    }
}

const addParticipantApi = async (groupId: string, participantEmails: string[]) => {
    try {
        let response = await api.post(
            '/api/chat/add-participant',
            {
                groupId,
                participantEmails
            }
        );
        return Promise.resolve(response.data);
    }
    catch (err: any) {
        return Promise.reject(err)
    }
}

export {
    getGroupsApi,
    addGroupApi,
    addParticipantApi
}