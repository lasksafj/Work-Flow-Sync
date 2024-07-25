import api from "../api";

const getGroupsApi = async () => {
    try {
        let response = await api.get(
            '/api/chat/get-groups',
        );
        return response.data;
    }
    catch (err: any) {
        console.log('getGroupsApi ERROR', err);
        return null;
    }
}

const createGroupApi = async (groupName: string) => {
    try {
        let response = await api.post('/api/chat/create-group', {
            groupName: groupName
        });
        return response.data;
    }
    catch (err: any) {
        console.log('createGroupApi ERROR', err);
        return null;
    }
}

const addParticipantApi = async (groupId: string, participantEmails: string[]) => {
    try {
        let response = await api.post('api/chat/add-participant', {
            groupId: groupId,
            participantEmails: participantEmails
        });
        return response.data;
    }
    catch (err: any) {
        console.log('addParticipantApi ERROR', err);
        return null;
    }
}

const getEmployeesApi = async (orgAbbr: string) => {
    try {
        let response = await api.get(`/api/chat/get-employees?orgAbbr=${orgAbbr}`);
        return response.data;
    }
    catch (err: any) {
        console.log('getEmployeesApi ERROR', err);
        return null;
    }
}

const getMessagesApi = async (groupId: string, limit: number, offset: number) => {
    try {
        let response = await api.get(`/api/chat/get-messages?groupId=${groupId}&&limit=${limit}&&offset=${offset}`);
        return response.data;
    }
    catch (err: any) {
        console.log('getMessagesApi ERROR', err);
        return null;
    }
}

const getParticipantsApi = async (groupId: string) => {
    try {
        let response = await api.get(`/api/chat/get-participants?groupId=${groupId}`);
        return response.data;
    }
    catch (err: any) {
        console.log('getParticipantsApi ERROR', err);
        return null;
    }
}

export {
    getGroupsApi,
    createGroupApi,
    addParticipantApi,
    getEmployeesApi,
    getMessagesApi,
    getParticipantsApi
}