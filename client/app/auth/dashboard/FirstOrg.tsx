import React from "react";
import { router } from "expo-router";
import { Text, StyleSheet, View, Modal, Button } from "react-native";
import { logout } from "@/apis/authorize/login";
import { userLogout } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/store/hooks";

// Props type definition for controlling the modal visibility
type FirstOrgProps = {
    firstOrgVisible: boolean;
    setFirstOrgVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

// Component to render the logout modal
const FirstOrg = ({
    firstOrgVisible,
    setFirstOrgVisible,
}: FirstOrgProps) => {
    // Redux dispatch hook
    const dispatch = useAppDispatch();

    // Render the modal
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={firstOrgVisible}
            onRequestClose={() => {
                setFirstOrgVisible(false);
            }}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>First Time</Text>
                    <Text style={styles.modalMessage}>
                        Welcome to Workflow Sync! You can choose your workplace below.
                    </Text>
                    <View style={styles.modalButtons}>
                        {/* Logout confirmation buttons */}
                        <Button
                            title="Submit"
                            onPress={async () => {
                                setFirstOrgVisible(false);
                            }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// Styles
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
});

export default FirstOrg;