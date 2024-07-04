import React, { useState } from "react";
import { router, Stack } from "expo-router";
import {
    ScrollView,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    Button,
    TextInput,
} from "react-native";
import { Feather as FeatherIcon } from "@expo/vector-icons";

const SECTIONS = [
    {
        header: "Profile Settings",
        items: [
            {
                id: "name",
                label: "Name",
                value: "John Doe",
                firstname: "John",
                lastname: "Doe",
            },
            { id: "email", label: "Email", value: "abc@gmail.com" },
            { id: "phone", label: "Phone", value: "1234567890" },
        ],
    },
    {
        header: "Workplace",
        items: [
            { id: "namewp", label: "Name", value: "McDonalds" },
            { id: "address", label: "Address", value: "123 Main St" },
            {
                id: "position",
                label: "Position",
                value: "FoodRunner",
            },
        ],
    },
];
type EditProps = {
    editModalVisible: boolean;
    setEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleEdit: () => void;
};

const EditProfile = ({
    editModalVisible,
    setEditModalVisible,
    handleEdit,
}: EditProps) => {
    const [name, setName] = useState("John Doe");
    const [email, setEmail] = useState("abc@gmail.com");
    const [phone, setPhone] = useState("1234567890");
    const [namewp, setNamewp] = useState("McDonalds");
    const [address, setAddress] = useState("123 Main St");
    const [position, setPosition] = useState("FoodRunner");
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={editModalVisible}
            onRequestClose={() => {
                setEditModalVisible(!editModalVisible);
            }}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => setEditModalVisible(false)}
                    >
                        <Text style={styles.title}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Edit User</Text>
                    <TouchableOpacity
                        onPress={() => {
                            alert("Saved!");
                        }}
                    >
                        <Text style={styles.title}>Save</Text>
                    </TouchableOpacity>
                </View>

                {SECTIONS.map(({ header, items }) => (
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
                                    <TouchableOpacity onPress={() => {}}>
                                        <View style={styles.row}>
                                            <Text style={styles.rowLabel}>
                                                {label}
                                            </Text>
                                            <View style={styles.rowSpacer} />
                                            {id === "name" ? (
                                                <TextInput
                                                    style={styles.rowValue}
                                                    value={name}
                                                    onChangeText={(text) =>
                                                        setName(text)
                                                    }
                                                />
                                            ) : id === "email" ? (
                                                <TextInput
                                                    style={styles.rowValue}
                                                    value={email}
                                                    onChangeText={(text) =>
                                                        setEmail(text)
                                                    }
                                                />
                                            ) : id === "phone" ? (
                                                <TextInput
                                                    style={styles.rowValue}
                                                    value={phone}
                                                    onChangeText={(text) =>
                                                        setPhone(text)
                                                    }
                                                />
                                            ) : id === "namewp" ? (
                                                <TextInput
                                                    style={styles.rowValue}
                                                    value={namewp}
                                                    onChangeText={(text) =>
                                                        setNamewp(text)
                                                    }
                                                />
                                            ) : id === "address" ? (
                                                <TextInput
                                                    style={styles.rowValue}
                                                    value={address}
                                                    onChangeText={(text) =>
                                                        setAddress(text)
                                                    }
                                                />
                                            ) : id === "position" ? (
                                                <TextInput
                                                    style={styles.rowValue}
                                                    value={position}
                                                    onChangeText={(text) =>
                                                        setPosition(text)
                                                    }
                                                />
                                            ) : (
                                                <Text style={styles.rowValue}>
                                                    {value}
                                                </Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </SafeAreaView>
        </Modal>
    );
};

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

export default EditProfile;
