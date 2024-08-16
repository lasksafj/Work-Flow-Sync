import React, { useEffect } from "react";
import { StyleSheet, View, Text, Modal, TouchableOpacity } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { Feather as FeatherIcon } from "@expo/vector-icons";
import api from "@/apis/api";
import { SafeAreaView } from "react-native";
import { AlphabetList } from "react-native-section-alphabet-list";
import { Colors } from "@/constants/Colors";
import { Avatar } from "@/components/Avatar";

type EmployeeProps = {
    employeeListVisible: boolean;
    setEmployeeListVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const EmployeeList = ({
    employeeListVisible,
    setEmployeeListVisible,
}: EmployeeProps) => {
    const organization = useAppSelector(
        (state: RootState) => state.organization
    );
    const [employees, setEmployees] = React.useState<any[]>([]);

    useEffect(() => {
        let org = organization.abbreviation;

        // dung get.then.catch la thay the cho async await
        api.get("/api/profile/profile-getAllUsers?org=" + org)
            .then((response) => {
                const res = response.data;
                let data = res.map((contact: any, index: number) => ({
                    value: `${contact.first_name} ${contact.last_name}`,
                    avatar: contact.avatar,
                    email: contact.email,
                    key: `${index}`,
                }));
                console.log(data);

                setEmployees(data);
            })
            .catch((error) => {
                alert(error);
            });
    }, [organization]); // [] dieu kien chay tiep. [] thi chay 1 lan

    // console.log("Phong test00000000000", employees);

    const Header = () => (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={() => {
                    setEmployeeListVisible(false);
                }}
            >
                <FeatherIcon
                    name="chevron-left"
                    size={25}
                    color="white"
                    style={styles.title}
                />
            </TouchableOpacity>
            <Text style={styles.title}>Employee List</Text>
            <Text style={styles.spacer} />
        </View>
    );

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={employeeListVisible}
            onRequestClose={() => {
                setEmployeeListVisible(false);
            }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <Header />
                <AlphabetList
                    data={employees}
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
                        <View style={styles.listItemContainer}>
                            <Avatar img={item.avatar} name={item.value} size={30} />
                            <View>
                                <Text style={{ color: "#000", fontSize: 14 }}>
                                    {item.value}
                                </Text>
                                <Text
                                    style={{
                                        color: Colors.gray,
                                        fontSize: 12,
                                    }}
                                >
                                    {item.email}
                                </Text>
                            </View>
                        </View>
                    )}
                    renderCustomSectionHeader={(section) => (
                        <View style={styles.sectionHeaderContainer}>
                            <Text style={{ color: Colors.gray }}>
                                {section.title}
                            </Text>
                        </View>
                    )}
                    style={{ flex: 1 }}
                />
            </SafeAreaView>
        </Modal>
    );
};

export default EmployeeList;

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        paddingHorizontal: 10,
        // marginBottom: 8,
        backgroundColor: "#008000",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
        marginBottom: 6,
        marginTop: 6,
    },
    spacer: {
        width: 25,
    },
    section: {
        marginTop: 12,
        paddingLeft: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#000",
    },
    sectionItems: {
        marginTop: 8,
    },
    card: {
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    cardWrapper: {
        borderBottomWidth: 1,
        borderColor: "#d6d6d6",
    },
    cardAvatar: {
        width: 42,
        height: 42,
    },
    cardBody: {
        marginLeft: 12,
        marginRight: "auto",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#000",
    },
    cardRole: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: "500",
        color: "#616d79",
        marginTop: 3,
    },
    profile: {
        padding: 16,
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    profileAvatar: {
        width: 50,
        height: 50,
        borderRadius: 9999,
    },
    initialsAvatar: {
        width: 80,
        height: 80,
        borderRadius: 9999,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    list: {
        flex: 1,
    },
    listItemImage: {},

    sectionHeaderContainer: {
        height: 30,
        backgroundColor: Colors.background,
        justifyContent: "center",
        paddingHorizontal: 14,
    },
    listItemContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        height: 50,
        paddingHorizontal: 14,
        backgroundColor: "#fff",
    },
});