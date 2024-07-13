import React, { useState } from "react";
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    TextInput,
} from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import api from "@/apis/api";
import { userLogin } from "@/store/slices/userSlice";

type EditProps = {
    editProfileVisible: boolean;
    setEditProfileVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

interface Item {
    id: string;
    label: string;
    value: string | undefined;
}

interface Section {
    header: string;
    items: Item[];
}

const EditProfile = ({
    editProfileVisible,
    setEditProfileVisible,
}: EditProps) => {
    const user = useAppSelector((state: RootState) => state.user);
    const dispatch = useAppDispatch(); //luu du lieu vao store va refresh app xai du lieu do

    // format date
    const dateString = user.profile.dateOfBirth;
    const date = dateString ? new Date(dateString) : undefined;
    const formatDate = (date?: Date): string => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Pad month to 2 digits
        const day = date.getDate().toString().padStart(2, "0"); // Pad day to 2 digits
        return `${year}-${month}-${day}`;
    };

    const [section, setSection] = useState<Section[]>([
        {
            header: "Profile Settings",
            items: [
                {
                    id: "firstName",
                    label: "First Name",
                    value: user.profile.firstName,
                },
                {
                    id: "lastName",
                    label: "Last Name",
                    value: user.profile.lastName,
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
                    value: formatDate(date),
                },
            ],
        },
    ]);

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={editProfileVisible}
            onRequestClose={() => {
                setEditProfileVisible(!editProfileVisible);
            }}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => setEditProfileVisible(false)}
                    >
                        <Text style={styles.title}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Edit User</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setEditProfileVisible(false);

                            api.put("/api/profile/profile-put", {
                                firstName: section[0].items[0].value,
                                lastName: section[0].items[1].value,
                                email: section[0].items[2].value,
                                phoneNumber: section[0].items[3].value,
                                dateOfBirth: section[0].items[4].value,
                            })
                                .then((res) => {
                                    console.log("EDIT PROFILE", res.data);
                                    let data = {
                                        profile: res.data,
                                        accessToken: user.accessToken,
                                    };
                                    dispatch(userLogin(data));
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }}
                    >
                        <Text style={styles.title}>Save</Text>
                    </TouchableOpacity>
                </View>

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
                                    <TouchableOpacity onPress={() => {}}>
                                        <View style={styles.row}>
                                            <Text style={styles.rowLabel}>
                                                {label}
                                            </Text>
                                            <View style={styles.rowSpacer} />
                                            <TextInput
                                                style={styles.rowValue}
                                                value={value}
                                                onChangeText={(text) => {
                                                    let updatedSection = [
                                                        ...section,
                                                    ];
                                                    const itemIndex =
                                                        updatedSection
                                                            .flatMap(
                                                                (section) =>
                                                                    section.items
                                                            )
                                                            .findIndex(
                                                                (item) =>
                                                                    item.id ===
                                                                    id
                                                            );
                                                    updatedSection.flatMap(
                                                        (section) =>
                                                            section.items
                                                    )[itemIndex].value = text;

                                                    setSection(updatedSection);
                                                }}
                                            />
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

export default EditProfile;

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
