import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native";
import {
    ScrollView,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    SectionList,
} from "react-native";
import { Feather as FeatherIcon } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { logout } from "@/apis/authorize/login";
import { userLogout } from "@/store/slices/userSlice";
import api from "@/apis/api";

import ImageProfile from "./src/ImageProfile";
import Logout from "./src/Logout";
import EditProfile from "./src/EditProfile";
import SwitchWorkplace from "./src/SwitchWorkplace";
import EmployeeList from "./src/EmployeeList";

interface ItemProps {
    id: string;
    label: string;
    value: any;
}

interface LinkProps {
    id: string;
    label: string;
    icon: any;
    type: string;
}

const ProfileScreen = () => {
    const router = useRouter();

    const user = useAppSelector((state: RootState) => state.user);
    const organization = useAppSelector(
        (state: RootState) => state.organization
    );
    const dispatch = useAppDispatch(); //luu du lieu vao store va refresh app xai du lieu do
    // console.log("ProfileScreen", user.profile);
    console.log("ProfileScreen", organization);

    // format date
    const date = user.profile.dateOfBirth
        ? new Date(user.profile.dateOfBirth)
        : undefined;

    const [role, setRole] = useState<string>("");

    let section = [
        {
            header: "Profile Settings",
            // use items for map, data for SectionList
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
                {
                    id: "dateOfBirth",
                    label: "Date of Birth",
                    value: date?.toISOString().split("T")[0],
                },
            ],
        },
        {
            header: "Workplace",
            // use items for map, data for SectionList
            items: [
                { id: "namewp", label: "Name", value: organization.name },
                {
                    id: "address",
                    label: "Address",
                    value: organization.address,
                },
                {
                    id: "position",
                    label: "Position",
                    value: role,
                },
            ],
        },
    ];

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
                    id: "employeelist",
                    label: "Employee List",
                    icon: "users" as const,
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

    useEffect(() => {
        let org = organization.abbreviation; // Organization ID
        api.get("/api/profile/profile-getRole?org=" + org)
            .then((response) => {
                const data = response.data;
                console.log(data);
                setRole(data.role);
            })
            .catch((error) => {
                alert(error);
            });
    }, [organization]); // [] dieu kien chay tiep. [] thi chay 1 lan

    // console.log("ProfileScreen", user.profile);
    const [logOutVisible, setLogOutVisible] = useState(false);
    const [editProfileVisible, setEditProfileVisible] = useState(false);
    const [switchWorkplaceVisible, setSwitchWorkplaceVisible] = useState(false);
    const [employeeListVisible, setEmployeeListVisible] = useState(false);

    const handleLogout = () => {
        setLogOutVisible(false);
        logout();
        dispatch(userLogout());
        router.replace("");
        // alert("Logged out!");
    };

    const renderSectionHeader = ({
        section: { header },
    }: {
        section: { header: string };
    }) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{header}</Text>
            </View>
        </View>
    );

    const RenderItems = ({ id, label, value }: ItemProps, index: number) => (
        <View
            style={[styles.rowWraper, index === 0 && { borderBottomWidth: 0 }]}
            key={id}
        >
            <View style={styles.row}>
                <Text style={styles.rowLabel}>{label}</Text>
                <View style={styles.rowSpacer} />
                <Text style={styles.rowValue}>{value}</Text>
            </View>
        </View>
    );

    const RenderLinkItems = ({ id, label, icon, type }: LinkProps, index: number) => (
        <View
            style={[styles.rowWraper, index === 0 && { borderBottomWidth: 0 },]}
            key={id}
        >
            <TouchableOpacity
                onPress={() => {
                    if (id === "logout") {
                        setLogOutVisible(true);
                        // console.log("Logout Pressed!");
                    }
                    if (id === "switchworkplace") {
                        setSwitchWorkplaceVisible(true);
                    }
                    if (id === "employeelist") {
                        setEmployeeListVisible(true);
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
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                <View style={styles.spacer} />
                <Text style={styles.title}>User</Text>
                <TouchableOpacity
                    onPress={() => {
                        setEditProfileVisible(true);
                    }}
                >
                    <Text style={styles.title}>Edit</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container}>
                <ImageProfile />

                {section.map(({ header, items }) => (
                    <View style={styles.section} key={header}>
                        {renderSectionHeader({ section: { header: header } })}
                        <View>
                            {items.map(({ id, label, value }, index) => (
                                RenderItems({ id, label, value }, index)
                            ))}
                        </View>
                    </View>
                ))}

                {LINKSECTIONS.map(({ header, items }) => (
                    <View style={styles.section} key={header}>
                        {renderSectionHeader({ section: { header: header } })}
                        <View>
                            {items.map(({ id, label, icon, type }, index) => (
                                RenderLinkItems({ id, label, icon, type }, index)
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>

            <Logout
                logOutVisible={logOutVisible}
                setLogOutVisible={setLogOutVisible}
                handleLogout={handleLogout}
            />
            <EditProfile
                editProfileVisible={editProfileVisible}
                setEditProfileVisible={setEditProfileVisible}
            />
            <SwitchWorkplace
                switchWorkplaceVisible={switchWorkplaceVisible}
                setSwitchWorkplaceVisible={setSwitchWorkplaceVisible}
            />
            <EmployeeList
                employeeListVisible={employeeListVisible}
                setEmployeeListVisible={setEmployeeListVisible}
            />
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {

    },
    header: {
        flexDirection: "row",
        paddingHorizontal: 10,
        // marginBottom: 8,
        backgroundColor: "#008000",
        justifyContent: "space-between",
        alignItems: "center",
    },
    spacer: {
        width: 25,
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
        textAlign: "right",
    },
});