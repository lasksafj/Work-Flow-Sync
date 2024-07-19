import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, Modal, TouchableOpacity } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { Feather as FeatherIcon } from "@expo/vector-icons";
import api from "@/apis/api";
import { set } from "date-fns";

type SwitchProps = {
    switchWorkplaceVisible: boolean;
    setSwitchWorkplaceVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
const SwitchWorkplace = ({
    switchWorkplaceVisible,
    setSwitchWorkplaceVisible,
}: SwitchProps) => {
    const user = useAppSelector((state: RootState) => state.user);
    const organization = useAppSelector(
        (state: RootState) => state.organization
    );
    const dispatch = useAppDispatch();
    const [workplaces, setWorkplaces] = React.useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        api.get("/api/profile/profile-getOrg")
            .then((response) => {
                const data = response.data;
                console.log(data);
                setWorkplaces(data);
            })
            .catch((error) => {
                alert(error);
            });
    }, []); // [] dieu kien chay tiep. [] thi chay 1 lan

    // console.log(workplaces);
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={switchWorkplaceVisible}
            onRequestClose={() => {
                setSwitchWorkplaceVisible(false);
            }}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => {
                            setSwitchWorkplaceVisible(false);
                        }}
                    >
                        <FeatherIcon
                            name="chevron-left"
                            size={25}
                            color="white"
                            style={styles.title}
                        />
                    </TouchableOpacity>
                    <Text style={styles.title}>Select Workplace</Text>
                    <View style={styles.spacer} />
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>
                            All Workplaces
                        </Text>
                    </View>
                    <View>
                        {workplaces.map(({name}, index) => (
                                <View
                                style={[
                                    styles.rowWraper,
                                    index === 0 && { borderBottomWidth: 0 },
                                ]}
                                key={index}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                    }}
                                >
                                    <View style={styles.row}>
                                        <FeatherIcon
                                            name="archive"
                                            size={20}
                                            color="#616161"
                                            style={{ marginRight: 12 }}
                                        />
                                        <Text style={styles.rowLabel}>
                                            {name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>
                            Add New Workplace
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.rowLabel}>Add a code</Text>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

export default SwitchWorkplace;

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
