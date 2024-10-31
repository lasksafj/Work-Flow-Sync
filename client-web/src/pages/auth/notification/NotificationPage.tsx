// pages/NotificationsPage.tsx
import api from "../../../apis/api";
import React, { useState, useEffect } from 'react';
// import {
//     fetchNotifications,
//     createNotification,
//     updateNotification,
//     deleteNotification,
// } from '../services/notificationService';

interface Notification {
    id: number;
    content: string;
    created_date: string;
    sender_id: number;
}

const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [newContent, setNewContent] = useState('');
    const [editingNotification, setEditingNotification] = useState<Notification | null>(null);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = () => {
        console.log("loadNotifications");
        api.get(
            `/api/notificationCRUD/notification-fetch`
        )
            .then((res) => {
                setNotifications(res.data);
            })
            .catch((err) => {
                console.log(err); // Handle error
            });
    };
    // const loadNotifications = async () => {
    //     const data = await fetchNotifications();
    //     setNotifications(data);
    // };

    // const handleCreate = async () => {
    //     const newNotification = await createNotification({
    //         content: newContent,
    //         created_date: new Date().toISOString(),
    //         sender_id: 1,
    //         is_read: false,
    //     });
    //     setNotifications([...notifications, newNotification]);
    //     setNewContent('');
    // };

    // const handleEdit = async (id: number, content: string) => {
    //     const updatedNotification = await updateNotification(id, { content });
    //     setNotifications(notifications.map(n => (n.id === id ? updatedNotification : n)));
    //     setEditingNotification(null);
    // };

    // const handleDelete = async (id: number) => {
    //     await deleteNotification(id);
    //     setNotifications(notifications.filter(n => n.id !== id));
    // };
    return (
        <div>
            <h2>Notifications</h2>

            {/* Create Notification */}
            <div>
                <textarea
                    placeholder="Enter new notification content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                />
                {/* <button onClick={handleCreate}>Create Notification</button> */}
                <button>Create Notification</button>
            </div>

            {/* Edit Notification */}
            {editingNotification && (
                <div>
                    <textarea
                        // value={editingNotification.content}
                        value="content"
                        onChange={(e) =>
                            setEditingNotification({
                                ...editingNotification,
                                content: e.target.value,
                            } as Notification)
                        }
                    />
                    <button
                        onClick={() => {}
                            // handleEdit(editingNotification.id, editingNotification.content)
                        }
                    >
                        Save
                    </button>
                    <button onClick={() => setEditingNotification(null)}>Cancel</button>
                </div>
            )}
            {/* List of Notifications */}
            <ul>
                {notifications.map((notification) => (
                    <li key={1}>
                        <p>{notification.content}</p>
                        <p>{notification.id}</p>
                        <small>{new Date(notification.created_date).toLocaleString()}</small>
                        <div>
                            <button onClick={() => setEditingNotification(notification)}>Edit</button>
                            {/* <button onClick={() => handleDelete(notification.id)}>Delete</button> */}
                            <button onClick={() => {}}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationsPage;
