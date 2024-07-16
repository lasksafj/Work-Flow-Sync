const chatService = require('../services/chatService');

exports.getGroups = async (req, res) => {
    try {
        let groups = await chatService.getGroups(req.user.id);
        groups = await Promise.all(groups.map(async (group, i) => {
            let mes = await chatService.getLastMessage(group.groupId);
            group.lastMessage = mes.content;
            group.lastMessageTime = mes.create_time;
            return group;
        }));
        res.status(200).json(groups);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createGroup = async (req, res) => {
    try {
        const { groupName } = req.body;
        const newGroup = await chatService.createGroup(groupName, req.user.id);
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.addParticipants = async (req, res) => {
    try {
        const { groupId, participantEmails } = req.body;
        await chatService.addParticipants(groupId, participantEmails, req.user.id);
        res.status(201).json({ message: 'Participants added successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getEmployees = async (req, res) => {
    try {
        const { orgAbbr } = req.query;
        const result = await chatService.getEmployees(orgAbbr);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.getMessages = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const messages = await chatService.getMessages(groupId, limit, offset);
        res.status(200).json(messages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// exports.postMessage = async (req, res) => {
//     try {
//         const { groupId, userId, message } = req.body;
//         const newMessage = await chatService.createMessage(groupId, userId, message);
//         res.status(201).json(newMessage);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

