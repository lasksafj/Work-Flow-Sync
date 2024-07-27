import React, { useEffect, useMemo } from "react";
import {
    StyleSheet,
    View,
    Text,
    Modal,
    TouchableOpacity,
    SectionList,
    Image,
} from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { Feather as FeatherIcon } from "@expo/vector-icons";
import api from "@/apis/api";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { all } from "axios";
import { Svg, Circle, Text as SvgText } from "react-native-svg";

type EmployeeProps = {
    employeeListVisible: boolean;
    setEmployeeListVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const EmployeeList = ({
    employeeListVisible,
    setEmployeeListVisible,
}: EmployeeProps) => {
    // const employees = [
    //     {
    //         id: "1",
    //         img: "",
    //         firstName: "Anh",
    //         lastName: "Doe",
    //     },
    //     {
    //         id: "2",
    //         img: "",
    //         firstName: "John",
    //         lastName: "Doe",
    //     },
    //     {
    //         id: "3",
    //         img: "",
    //         firstName: "Long",
    //         lastName: "Doe",
    //     },
    //     {
    //         id: "4",
    //         img: "",
    //         firstName: "Huy",
    //         lastName: "Doe",
    //     },
    //     {
    //         id: "5",
    //         img: "",
    //         firstName: "Bao",
    //         lastName: "Doe",
    //     },
    //     {
    //         id: "6",
    //         img: "",
    //         firstName: "Linh",
    //         lastName: "Doe",
    //     },
    //     {
    //         id: "7",
    //         img: "",
    //         firstName: "Anh",
    //         lastName: "Doe",
    //     },
    //     {
    //         id: "8",
    //         img: "",
    //         firstName: "John",
    //         lastName: "Doe",
    //     },
    //     {
    //         id: "9",
    //         img: "",
    //         firstName: "Long",
    //         lastName: "Doe",
    //     },
    //     {
    //         id: "10",
    //         img: "",
    //         firstName: "Huy",
    //         lastName: "Doe",
    //     },
    //     {
    //         id: "11",
    //         img: "",
    //         firstName: "Bao",
    //         lastName: "Doe",
    //     },
    //     {
    //         id: "12",
    //         img: "",
    //         firstName: "Linh",
    //         lastName: "Doe",
    //     },
    // ];

    const organization = useAppSelector(
        (state: RootState) => state.organization
    );
    const [employees, setEmployees] = React.useState<any[]>([]);

    useEffect(() => {
        let org = organization.abbreviation;
        api.get("/api/profile/profile-getAllUsers?org=" + org)
            .then((response) => {
                const data = response.data;
                console.log(data);
                setEmployees(data);
            })
            .catch((error) => {
                alert(error);
            });
    }, []); // [] dieu kien chay tiep. [] thi chay 1 lan

    // console.log("Phong test00000000000", employees);
    const groupEmployeesByFirstLetter = (employees: any[]) => {
        const grouped = employees.reduce((acc, employee) => {
            const firstName = employee.firstName;
            const firstLetter = firstName[0] ? firstName[0].toUpperCase() : "";
            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(employee);
            return acc;
        }, {});

        // console.log("Phongsfgasfbv test", grouped);
        // Convert the grouped object to an array of sections
        return Object.keys(grouped)
            .sort()
            .map((letter) => ({
                title: letter,
                data: grouped[letter],
            }));
    };

    // console.log(
    //     "Phong test1111111111",
    //     groupEmployeesByFirstLetter(employees).map((section) => section.title)
    // );
    const sections = useMemo(
        () => groupEmployeesByFirstLetter(employees),
        [employees]
    );
    // console.log(
    //     "Phong test",
    //     sections.map((section) => section.title)
    // );

    const InitialImg = (img: string, initials: string) => (
        <View style={styles.profile}>
            {img ? (
                <Image
                    resizeMode="cover"
                    style={styles.profileAvatar}
                    source={{
                        uri: img,
                    }}
                    alt="Avarar"
                />
            ) : (
                <View style={styles.initialsAvatar}>
                    <Svg height="50" width="50">
                        <Circle cx="25" cy="25" r="25" fill="#6200EE" />
                        <SvgText
                            fill="white"
                            fontSize="20"
                            fontWeight="bold"
                            x="25"
                            y="32"
                            textAnchor="middle"
                        >
                            {initials}
                        </SvgText>
                    </Svg>
                </View>
            )}
        </View>
    );

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

    const renderSectionHeader = ({
        section: { title },
    }: {
        section: { title: string };
    }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    type ItemProps = {
        id: string;
        img: string;
        firstName: string;
        lastName: string;
    };

    const Item = ({ id, img, firstName, lastName }: ItemProps) => (
        <View style={styles.sectionItems}>
            <View style={styles.cardWrapper}>
                <View style={styles.card}>
                    {InitialImg(img, `${firstName[0]}${lastName[0]}`)}
                    <View style={styles.cardBody}>
                        <Text style={styles.cardTitle}>
                            {firstName} {lastName}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
    // console.log("---------------", sections[0]);

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
                <SectionList
                    sections={sections}
                    renderItem={({ item }) => <Item {...item} />}
                    renderSectionHeader={renderSectionHeader}
                    keyExtractor={(item) => item.id}
                    style={styles.list}
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
    cardImg: {
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
});
