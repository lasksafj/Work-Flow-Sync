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

const EditProfileOld = ({
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

export default EditProfileOld;

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

// router.push({
//     pathname: "auth/profile/src/EditProfile",
//     params: {
//         org: section[1].items[0].value,
//         address: section[1].items[1].value,
//         role: section[1].items[2].value,
//     },
// });
// alert("Edit Pressed!");

{
    /* <Svg height="100" width="100">
                                    <Circle
                                        cx="50"
                                        cy="50"
                                        r="50"
                                        fill="#6200EE"
                                    />
                                    <SvgText
                                        fill="white"
                                        fontSize="40"
                                        fontWeight="bold"
                                        x="50"
                                        y="65"
                                        textAnchor="middle"
                                    >
                                        {initials}
                                    </SvgText>
                                </Svg> */
}

// initialsContainer: {
//     width: 80,
//     height: 80,
//     borderRadius: 9999,
//     overflow: "hidden",
//     justifyContent: "center",
//     alignItems: "center",
// },

{
    /* <TouchableOpacity
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
                </TouchableOpacity> */
}

//EmployeeList - Old Version
// type EmployeeProps = {
//     employeeListVisible: boolean;
//     setEmployeeListVisible: React.Dispatch<React.SetStateAction<boolean>>;
// };

// const EmployeeList = ({
//     employeeListVisible,
//     setEmployeeListVisible,
// }: EmployeeProps) => {
//     const organization = useAppSelector(
//         (state: RootState) => state.organization
//     );
//     const [employees, setEmployees] = React.useState<any[]>([]);

//     useEffect(() => {
//         let org = organization.abbreviation;
//         api.get("/api/profile/profile-getAllUsers?org=" + org)
//             .then((response) => {
//                 const data = response.data;
//                 console.log(data);
//                 setEmployees(data);
//             })
//             .catch((error) => {
//                 alert(error);
//             });
//     }, [organization]); // [] dieu kien chay tiep. [] thi chay 1 lan

//     // console.log("Phong test00000000000", employees);
//     const groupEmployeesByFirstLetter = (employees: any[]) => {
//         const grouped = employees.reduce((acc, employee) => {
//             const firstName = employee.firstName;
//             const firstLetter = firstName[0] ? firstName[0].toUpperCase() : "";
//             if (!acc[firstLetter]) {
//                 acc[firstLetter] = [];
//             }
//             acc[firstLetter].push(employee);
//             return acc;
//         }, {});

//         // console.log("Phongsfgasfbv test", grouped);
//         // Convert the grouped object to an array of sections
//         return Object.keys(grouped)
//             .sort()
//             .map((letter) => ({
//                 title: letter,
//                 data: grouped[letter],
//             }));
//     };

//     // console.log(
//     //     "Phong test1111111111",
//     //     groupEmployeesByFirstLetter(employees).map((section) => section.title)
//     // );
//     const sections = useMemo(
//         () => groupEmployeesByFirstLetter(employees),
//         [employees]
//     );
//     // console.log(
//     //     "Phong test",
//     //     sections.map((section) => section.title)
//     // );

//     const InitialAvatar = (avatar: string, initials: string) => (
//         <View style={styles.profile}>
//             {avatar ? (
//                 <Image
//                     resizeMode="cover"
//                     style={styles.profileAvatar}
//                     source={{
//                         uri: avatar,
//                     }}
//                     alt="Avarar"
//                 />
//             ) : (
//                 <View style={styles.initialsAvatar}>
//                     <Svg height="50" width="50">
//                         <Circle cx="25" cy="25" r="25" fill="#6200EE" />
//                         <SvgText
//                             fill="white"
//                             fontSize="20"
//                             fontWeight="bold"
//                             x="25"
//                             y="32"
//                             textAnchor="middle"
//                         >
//                             {initials}
//                         </SvgText>
//                     </Svg>
//                 </View>
//             )}
//         </View>
//     );

//     const Header = () => (
//         <View style={styles.header}>
//             <TouchableOpacity
//                 onPress={() => {
//                     setEmployeeListVisible(false);
//                 }}
//             >
//                 <FeatherIcon
//                     name="chevron-left"
//                     size={25}
//                     color="white"
//                     style={styles.title}
//                 />
//             </TouchableOpacity>
//             <Text style={styles.title}>Employee List</Text>
//             <Text style={styles.spacer} />
//         </View>
//     );

//     const renderSectionHeader = ({
//         section: { title },
//     }: {
//         section: { title: string };
//     }) => (
//         <View style={styles.section}>
//             <Text style={styles.sectionTitle}>{title}</Text>
//         </View>
//     );

//     type ItemProps = {
//         id: string;
//         avatar: string;
//         firstName: string;
//         lastName: string;
//     };

//     const Item = ({ id, avatar, firstName, lastName }: ItemProps) => (
//         <View style={styles.sectionItems}>
//             <View style={styles.cardWrapper}>
//                 <View style={styles.card}>
//                     {InitialAvatar(avatar, `${firstName[0]}${lastName[0]}`)}
//                     <View style={styles.cardBody}>
//                         <Text style={styles.cardTitle}>
//                             {firstName} {lastName}
//                         </Text>
//                     </View>
//                 </View>
//             </View>
//         </View>
//     );
//     // console.log("---------------", sections[0]);

//     return (
//         <Modal
//             animationType="slide"
//             transparent={false}
//             visible={employeeListVisible}
//             onRequestClose={() => {
//                 setEmployeeListVisible(false);
//             }}
//         >
//             <SafeAreaView style={{ flex: 1 }}>
//                 <Header />
//                 <SectionList
//                     sections={sections}
//                     renderItem={({ item }) => <Item {...item} />}
//                     renderSectionHeader={renderSectionHeader}
//                     keyExtractor={(item) => item.id}
//                     style={styles.list}
//                 />
//             </SafeAreaView>
//         </Modal>
//     );
// };

// export default EmployeeList;

// const styles = StyleSheet.create({
//     header: {
//         flexDirection: "row",
//         paddingHorizontal: 10,
//         // marginBottom: 8,
//         backgroundColor: "#008000",
//         justifyContent: "space-between",
//         alignItems: "center",
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: "700",
//         color: "white",
//         marginBottom: 6,
//         marginTop: 6,
//     },
//     spacer: {
//         width: 25,
//     },
//     section: {
//         marginTop: 12,
//         paddingLeft: 24,
//     },
//     sectionTitle: {
//         fontSize: 20,
//         fontWeight: "700",
//         color: "#000",
//     },
//     sectionItems: {
//         marginTop: 8,
//     },
//     card: {
//         paddingVertical: 14,
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "flex-start",
//     },
//     cardWrapper: {
//         borderBottomWidth: 1,
//         borderColor: "#d6d6d6",
//     },
//     cardAvatar: {
//         width: 42,
//         height: 42,
//     },
//     cardBody: {
//         marginLeft: 12,
//         marginRight: "auto",
//     },
//     cardTitle: {
//         fontSize: 16,
//         fontWeight: "700",
//         color: "#000",
//     },
//     cardRole: {
//         fontSize: 15,
//         lineHeight: 20,
//         fontWeight: "500",
//         color: "#616d79",
//         marginTop: 3,
//     },
//     profile: {
//         padding: 16,
//         flexDirection: "column",
//         alignItems: "center",
//         backgroundColor: "#fff",
//     },
//     profileAvatar: {
//         width: 50,
//         height: 50,
//         borderRadius: 9999,
//     },
//     initialsAvatar: {
//         width: 80,
//         height: 80,
//         borderRadius: 9999,
//         overflow: "hidden",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     list: {
//         flex: 1,
//     },
// });
