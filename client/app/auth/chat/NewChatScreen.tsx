import { View, Text, StyleSheet, Image, Pressable, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '@/constants/Colors';
import { AlphabetList } from 'react-native-section-alphabet-list';
import { useEffect, useState } from 'react';
import api from '@/apis/api';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import InitialNameAvatar from '@/components/InitialNameAvatar';
import { useNavigation } from 'expo-router';


const NewChatScreen = () => {
    const organization = useAppSelector((state: RootState) => state.organization);
    const user = useAppSelector((state: RootState) => state.user)

    const navigation = useNavigation();

    const [contacts, setContacts] = useState([]);
    const [selectedNames, setSelectedNames] = useState<string[]>([]);
    const [groupName, setGroupName] = useState('');

    const addName = (name: string) => {
        if (!selectedNames.includes(name))
            setSelectedNames([...selectedNames, name]);
    };

    const removeName = (name: string) => {
        setSelectedNames(selectedNames.filter(item => item !== name));
    };

    const createGroup = () => {
        if (selectedNames.length == 0)
            return;
        // api.post('/api/chat/create-group', ) 
    }

    useEffect(() => {
        api.get(`/api/chat/get-employees?orgAbbr=${organization.abbreviation}`)
            .then((res) => {
                let data = res.data.map((contact: any, index: number) => ({
                    value: `${contact.first_name} ${contact.last_name}`,
                    email: contact.email,
                    img: contact.img,
                    key: `${index}`,
                }));
                data = data.filter((contact: any) => contact.email !== user.profile.email);
                setContacts(data);
            })
            .catch(err => {
                console.log('NEWCHATSCREEN get-employees', err);
            });

        navigation.setOptions({
            headerRight: () =>
                <TouchableOpacity
                    onPress={createGroup}
                >
                    <Text style={{ fontSize: 20 }}>Create</Text>
                </TouchableOpacity>
        });
    }, [])

    return (
        <View style={{ backgroundColor: Colors.background }}>
            <TextInput
                style={styles.groupNameInput}
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
            />
            <FlatList
                data={selectedNames}
                horizontal
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <Pressable onPress={() => removeName(item)}>
                        <Text style={styles.selectedName}>{item}</Text>
                    </Pressable>
                )}
                style={styles.selectedList}
            />

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
                            onPress={() => addName(item.value)}
                        >
                            {
                                item.img ?
                                    <Image source={{ uri: item.img }} style={styles.listItemImage} />
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
    },
});

export default NewChatScreen;

function dispatch(arg0: any) {
    throw new Error('Function not implemented.');
}
