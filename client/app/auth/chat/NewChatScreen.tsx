import { View, Text, StyleSheet, Image, Pressable, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '@/constants/Colors';
import { AlphabetList } from 'react-native-section-alphabet-list';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import InitialNameAvatar from '@/components/InitialNameAvatar';
import Icon from 'react-native-vector-icons/Feather';
import { router, useNavigation } from 'expo-router';
import { addParticipantApi, createGroupApi, getEmployeesApi, getGroupWith2ParticipantsApi } from '@/apis/chat/chatApi';

const NewChatHeader = ({ closeNewChat }: any) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={closeNewChat}
                style={{ width: 50 }}
            >
                <Icon name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold', }}>New Chat</Text>
            <View style={{ width: 50 }} />
        </View>
    )
}

const NewChatScreen = () => {
    const organization = useAppSelector((state: RootState) => state.organization);
    const user = useAppSelector((state: RootState) => state.user)

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <TouchableOpacity
                    onPress={createGroup}
                >
                    <Text style={{ fontSize: 20 }}>Create</Text>
                </TouchableOpacity>
        });
    })

    const [contacts, setContacts] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);
    const [groupName, setGroupName] = useState('');

    const addParticipant = (participant: any) => {
        if (!selectedParticipants.some(p => p.email == participant.email))
            setSelectedParticipants([...selectedParticipants, participant]);
    };

    const removeParticipant = (participant: any) => {
        setSelectedParticipants(selectedParticipants.filter(item => item.email !== participant.email));
    };

    const createGroup = async () => {
        console.log('selectedParticipants', selectedParticipants);

        if (selectedParticipants.length == 0)
            return;
        let gname = groupName;
        if (selectedParticipants.length == 1) {
            if (gname) {
                return;
            }
            let group = await getGroupWith2ParticipantsApi(user.profile.email, selectedParticipants[0].email);
            if (group) {
                router.navigate({
                    pathname: 'auth/chat/ChatListScreen',
                    params: {
                        groupId: group.id,
                        groupName: '',
                        groupImg: '',
                        groupCreatedAt: '',
                    }
                });
                return;
            }

        }


        // if (gname == '') {
        //     if (selectedParticipants.length == 1)
        //         gname = selectedParticipants[0].name;
        //     else
        //         gname = selectedParticipants[0].name + ', ' + selectedParticipants[1].name;

        //     const userName = user.profile.firstName + ' ' + user.profile.lastName;
        //     gname = selectedParticipants.map(participant => participant.name).join(', ');
        //     gname += ', ' + userName;
        // }

        let group = await createGroupApi(gname);
        if (!group)
            return;
        const res = await addParticipantApi(
            group.id,
            selectedParticipants.map((p) => p.email)
        );
        if (!res)
            return;

        router.navigate({
            pathname: 'auth/chat/ChatListScreen',
            params: {
                groupId: group.id,
                groupName: group.name,
                groupImg: group.img,
                groupCreatedAt: group.created_at,
            }
        });
    }

    useEffect(() => {
        async function getEmployees() {
            const res = await getEmployeesApi(organization.abbreviation);
            if (!res)
                return;
            let data = res.map((contact: any, index: number) => ({
                value: `${contact.first_name} ${contact.last_name}`,
                email: contact.email,
                avatar: contact.avatar,
                key: `${index}`,
            }));
            data = data.filter((contact: any) => contact.email !== user.profile.email);
            setContacts(data);
        }
        getEmployees();

    }, [])

    return (
        <View style={{ backgroundColor: Colors.background }}>
            <TextInput
                style={styles.groupNameInput}
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
            />
            <View style={styles.selectedList}>
                <FlatList
                    data={selectedParticipants}
                    horizontal
                    keyExtractor={(item) => item.email}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => removeParticipant(item)}>
                            <Text style={styles.selectedName}>{item.name}</Text>
                        </Pressable>
                    )}

                />
            </View>

            <AlphabetList
                data={contacts}
                stickySectionHeadersEnabled
                indexLetterStyle={{
                    color: Colors.primary,
                    fontSize: 12,
                }}
                indexContainerStyle={{
                    width: 24,
                    backgroundColor: Colors.background,
                }}
                renderCustomItem={(item: any) => (
                    <>
                        <TouchableOpacity style={styles.listItemContainer}
                            onPress={() => addParticipant({ name: item.value, email: item.email })}
                        >
                            {
                                item.avatar ?
                                    <Image source={{ uri: item.avatar }} style={styles.listItemImage} />
                                    :
                                    <InitialNameAvatar name={item.value} size={30} />
                            }
                            <View>
                                <Text style={{ color: '#000', fontSize: 14 }}>{item.value}</Text>
                                <Text style={{ color: Colors.gray, fontSize: 12 }}>
                                    {item.email}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={[defaultStyles.separator, { marginLeft: 50 }]} />
                    </>
                )}
                renderCustomSectionHeader={(section) => (
                    <View style={styles.sectionHeaderContainer}>
                        <Text style={{ color: Colors.gray }}>{section.title}</Text>
                    </View>
                )}
                style={{
                    marginLeft: 14,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    listItemContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        height: 50,
        paddingHorizontal: 14,
        backgroundColor: '#fff',
    },

    listItemImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },

    sectionHeaderContainer: {
        height: 30,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        paddingHorizontal: 14,
    },

    selectedList: {
        marginVertical: 10,
    },
    selectedName: {
        fontSize: 18,
        color: 'white',
        backgroundColor: 'blue',
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 10,
        borderRadius: 5,
    },
    groupNameInput: {
        height: 40,
        backgroundColor: 'white',
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: Colors.lightGray,
        borderBottomWidth: 1,
        padding: 15
    }
});

const defaultStyles = StyleSheet.create({
    block: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 14,
        marginTop: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.lightGray,
        marginLeft: 50,
    }
});

export default NewChatScreen;

function dispatch(arg0: any) {
    throw new Error('Function not implemented.');
}
