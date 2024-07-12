import api from "../api";

const getGroupsApi = async () => {
    try {
        let response = await api.get(
            '/api/chat/get-groups',
        );
        return Promise.resolve(response);
    }
    catch (err: any) {
        console.log("GET GROUPS FAILED", err);
        return Promise.reject(err)
    }
}

export {
    getGroupsApi
}