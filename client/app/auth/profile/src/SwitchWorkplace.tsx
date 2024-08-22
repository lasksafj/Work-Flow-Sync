import React, { useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    TextInput,
    Dimensions,
} from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { Feather as FeatherIcon } from "@expo/vector-icons";
import api from "@/apis/api";
import { updateOrganization } from "@/store/slices/organizationSlice";
import { router } from "expo-router";
import { SafeAreaView } from "react-native";
import { FlashList } from "@shopify/flash-list";

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
    const [text, onChangeText] = React.useState("");
    const [workplaces, setWorkplaces] = React.useState<
        {
            id: string;
            abbreviation: string;
            name: string;
            address: string;
        }[]
    >([]);

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
    type ItemProps = {
        id: string;
        name: string;
        abbreviation: string;
        address: string;
    };

    const Header = () => (
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
    );

    const Item = ({ id, name, abbreviation, address }: ItemProps) => (
        <View style={styles.rowWraper}>
            <TouchableOpacity
                onPress={() => {
                    dispatch(
                        updateOrganization({
                            id: id,
                            abbreviation: abbreviation,
                            name: name,
                            address: address,
                        })
                    );
                    setSwitchWorkplaceVisible(false);
                    router.replace("auth");
                }}
            >
                <View>
                    <View style={styles.row}>
                        <FeatherIcon
                            name="archive"
                            size={20}
                            color="#616161"
                            style={{ marginRight: 12 }}
                        />
                        <Text style={styles.rowLabel}>{name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={switchWorkplaceVisible}
            onRequestClose={() => {
                setSwitchWorkplaceVisible(false);
            }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <Header />
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>
                            All Workplaces
                        </Text>
                    </View>
                    <FlashList
                        data={workplaces}
                        renderItem={({ item }) => <Item {...item} />}
                        estimatedItemSize={200}
                        keyExtractor={(item) => item.id}
                    />
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>
                            Add New Workplace
                        </Text>
                    </View>
                    <View>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeText}
                            value={text}
                            placeholder="Add your code here"
                        />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 6,
        marginTop: 6,
    },
    spacer: {
        width: 25,
    },
    section: {
        height: 200,
        width: Dimensions.get("screen").width,
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
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});