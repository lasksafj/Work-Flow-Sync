import React, { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    ScrollView,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
} from "react-native";
import { Feather as FeatherIcon } from "@expo/vector-icons";

import ImageProfile from "./src/ImageProfile";
import Logout from "./src/Logout";
import EditProfile from "./src/EditProfile";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { logout } from "@/apis/authorize/login";
import { userLogout } from "@/store/slices/userSlice";
import api from "@/apis/api";

const ProfileScreen = () => {
    // api.get("/api/example/example-get?number=999")
    //     .then((response) => {
    //         alert(response.data.number);
    //     })
    //     .catch((error) => {
    //         alert(error);
    //     });

    // api.post("/api/example/example-post", { number: 100 })
    //     .then((response) => {
    //         alert(response.data.number);
    //     })
    //     .catch((error) => {
    //         alert(error);
    //     });

    const user = useAppSelector((state: RootState) => state.user);
    const dispatch = useAppDispatch();

    const [section, setSection] = useState<any[]>([
        {
            header: "Profile Settings",
            items: [
                {
                    id: "name",
                    label: "Name",
                    value: user.profile.firstName + " " + user.profile.lastName,
                },
                { id: "email", label: "Email", value: user.profile.email },
                {
                    id: "phone",
                    label: "Phone",
                    value: user.profile.phoneNumber,
                },
            ],
        },
        {
            header: "Workplace",
            items: [
                { id: "namewp", label: "Name", value: "" },
                {
                    id: "address",
                    label: "Address",
                    value: "",
                },
                {
                    id: "position",
                    label: "Position",
                    value: "",
                },
            ],
        },
    ]);

    useEffect(() => {
        let org = "ORG1"; // Example organization ID
        api.get("/api/profile/profile-get?org=" + org)
            .then((response) => {
                const data = response.data;
                console.log(data);
                let newSection = [...section];
                newSection[1].items[0].value = data.orgname;
                newSection[1].items[1].value = data.address;
                newSection[1].items[2].value = data.role;

                // console.log(newSection[1].items[0].value);

                setSection(newSection);
            })
            .catch((error) => {
                alert(error);
            });
    }, []); // [] dieu kien chay tiep. [] thi chay 1 lan

    const LINKSECTIONS = [
        {
            header: "Utilities",
            items: [
                {
                    id: "request",
                    label: "Request",
                    icon: "archive" as const,
                    type: "link",
                },
                {
                    id: "switchworkplace",
                    label: "Switch Workplace",
                    icon: "refresh-cw" as const,
                    type: "link",
                },
                {
                    id: "logout",
                    label: "Log Out",
                    icon: "log-out" as const,
                    type: "trigger",
                },
            ],
        },
    ];
    const imageUrl: string = "https://reactjs.org/logo-og.png";
    // const imageUrl = "";
    const initials = `${user.profile.firstName?.[0] ?? ""}${
        user.profile.lastName?.[0] ?? ""
    }`.toUpperCase();

    // console.log("ProfileScreen", user.profile);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    const handleLogout = () => {
        setModalVisible(false);
        logout();
        dispatch(userLogout());
        router.replace("");
        // alert("Logged out!");
    };

    const handleEdit = () => {
        setEditModalVisible(false);
        alert("Edit Pressed!");
    };
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        alert("Back Pressed!");
                    }}
                >
                    <FeatherIcon
                        name="chevron-left"
                        size={25}
                        color="white"
                        style={styles.title}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>User</Text>
                <TouchableOpacity
                    onPress={() => {
                        setEditModalVisible(true);
                        // alert("Edit Pressed!");
                    }}
                >
                    <Text style={styles.title}>Edit</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container}>
                <ImageProfile initials={initials} imageUrl={imageUrl} />

                {section.map(({ header, items }) => (
                    <View style={styles.section} key={header}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>
                                {header}
                            </Text>
                        </View>
                        <View>
                            {items.map(({ id, label, value }, index) => (
                                <View
                                    style={[
                                        styles.rowWraper,
                                        index === 0 && { borderBottomWidth: 0 },
                                    ]}
                                    key={id}
                                >
                                    <View style={styles.row}>
                                        <Text style={styles.rowLabel}>
                                            {label}
                                        </Text>
                                        <View style={styles.rowSpacer} />
                                        <Text style={styles.rowValue}>
                                            {value}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                {LINKSECTIONS.map(({ header, items }) => (
                    <View style={styles.section} key={header}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>
                                {header}
                            </Text>
                        </View>
                        <View>
                            {items.map(({ id, label, icon, type }, index) => (
                                <View
                                    style={[
                                        styles.rowWraper,
                                        index === 0 && { borderBottomWidth: 0 },
                                    ]}
                                    key={id}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (id === "logout") {
                                                setModalVisible(true);
                                                // console.log("Logout Pressed!");
                                            }
                                        }}
                                    >
                                        <View style={styles.row}>
                                            <FeatherIcon
                                                name={icon}
                                                size={20}
                                                color="#616161"
                                                style={{ marginRight: 12 }}
                                            />
                                            <Text style={styles.rowLabel}>
                                                {label}
                                            </Text>
                                            <View style={styles.rowSpacer} />
                                            {["link"].includes(type) && (
                                                <FeatherIcon
                                                    name="chevron-right"
                                                    size={20}
                                                    color="#616161"
                                                />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
            <Logout
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                handleLogout={handleLogout}
            />
            <EditProfile
                editModalVisible={editModalVisible}
                setEditModalVisible={setEditModalVisible}
                handleEdit={handleEdit}
            />
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f6f6f6",
    },
    container: {
        // paddingVertical: 24,
    },
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
    section: {
        // paddingTop: 12,
    },
    sectionHeader: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        backgroundColor: "lightgray",
    },
    sectionHeaderText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#a7a7a7",
        textTransform: "uppercase",
        letterSpacing: 1.2,
    },
    // sectionBody: {
    //   paddingHorizontal: 24,
    //   paddingVertical: 12,
    // },
    //make line for each row
    rowWraper: {
        paddingLeft: 24,
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        backgroundColor: "#fff",
    },
    row: {
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingRight: 24,
    },
    rowLabel: {
        fontSize: 17,
        fontWeight: "500",
        color: "#000",
    },
    rowSpacer: {
        flex: 1,
    },
    rowValue: {
        fontSize: 17,
        color: "#616161",
        marginRight: 4,
    },
});
