import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { Alert, SafeAreaView } from "react-native";
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Feather as FeatherIcon } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import api from "@/apis/api";

// Custom components
import ImageProfile from "./src/ImageProfile";
import SwitchWorkplace from "./src/SwitchWorkplace";
import EditProfile from "./src/EditProfile";
import EmployeeList from "./src/EmployeeList";
import Logout from "./src/Logout";
import ChangePassword from "./src/ChangePassword";
import AlertPreference from "./src/AlertPreference";


// Interface of Profile Items
interface ItemProps {
    id: string;
    label: string;
    value: any;
}

// Interface of Link Items
interface LinkProps {
    id: string;
    label: string;
    icon: any;
    type: string;
}

// Main component for the Profile screen
const ProfileScreen = () => {
    // Navigation
    const navigation = useNavigation();

    //Select user and organization data from Redux store
    const user = useAppSelector((state: RootState) => state.user);
    const organization = useAppSelector(
        (state: RootState) => state.organization
    );

    // Format Date of Birth
    const date = user.profile.dateOfBirth
        ? new Date(user.profile.dateOfBirth)
        : undefined;

    const [role, setRole] = useState<string>("");

    // Profile and workplace information sections
    let section = [
        {
            header: "Profile Settings",
            // Profile data for display
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
            // Organization data for display
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

    // Link sections for utilities
    const LINKSECTIONS = [
        {
            header: "Utilities",
            items: [

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
                    id: "alertpreference",
                    label: "Alert Preferences",
                    icon: "alert-triangle" as const,
                    type: "link",
                },
                {
                    id: "changepassword",
                    label: "Change Password",
                    icon: "lock" as const,
                    type: "trigger",
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

    // Set header title and edit button
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => {
                        setEditProfileVisible(true);
                    }}
                >
                    <Text style={styles.title}>Edit</Text>
                </TouchableOpacity>
            ),
            headerTitleStyle: styles.title,
        });
    }, []);

    // Get user role in organization
    useEffect(() => {
        let org = organization.abbreviation; // Organization ID
        api.get("/api/profile/profile-getRole?org=" + org)
            .then((response) => {
                const data = response.data;
                setRole(data.role);
            })
            .catch((error) => {
                alert(error);
            });
    }, [organization]); // [] dieu kien chay tiep. [] thi chay 1 lan

    const [switchWorkplaceVisible, setSwitchWorkplaceVisible] = useState(false);
    const [editProfileVisible, setEditProfileVisible] = useState(false);
    const [employeeListVisible, setEmployeeListVisible] = useState(false);
    const [logOutVisible, setLogOutVisible] = useState(false);
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);

    // Helper function to render section header
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

    // Helper function to render items
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

    // Helper function to render link items
    const RenderLinkItems = ({ id, label, icon, type }: LinkProps, index: number) => (
        <View
            style={[styles.rowWraper, index === 0 && { borderBottomWidth: 0 },]}
            key={id}
        >
            <TouchableOpacity
                onPress={() => {
                    if (id === "switchworkplace") {
                        setSwitchWorkplaceVisible(true);
                    }
                    if (id === "logout") {
                        setLogOutVisible(true);
                    }
                    if (id === "employeelist") {
                        setEmployeeListVisible(true);
                    }
                    if (id === "changepassword") {
                        setChangePasswordVisible(true);
                    }
                    if (id === "alertpreference") {
                        setAlertVisible(true);
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

    // Render the Profile screen
    return (
        <SafeAreaView style={{ flex: 1 }}>
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

            {/* Switch Workplace Modal */}
            <SwitchWorkplace
                switchWorkplaceVisible={switchWorkplaceVisible}
                setSwitchWorkplaceVisible={setSwitchWorkplaceVisible}
            />
            <EditProfile
                editProfileVisible={editProfileVisible}
                setEditProfileVisible={setEditProfileVisible}
            />
            <EmployeeList
                employeeListVisible={employeeListVisible}
                setEmployeeListVisible={setEmployeeListVisible}
            />
            <Logout
                logOutVisible={logOutVisible}
                setLogOutVisible={setLogOutVisible}
            />
            <ChangePassword
                changePasswordVisible={changePasswordVisible}
                setChangePasswordVisible={setChangePasswordVisible}
            />
            <AlertPreference
                alertVisible={alertVisible}
                setAlertVisible={setAlertVisible}
            />

        </SafeAreaView>
    );
};

export default ProfileScreen;

// Styles
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