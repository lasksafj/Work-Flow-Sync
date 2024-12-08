import React, { useEffect } from "react";
import { StyleSheet, View, Text, Modal, TouchableOpacity, TextInput } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { Feather as FeatherIcon } from "@expo/vector-icons";
import api from "@/apis/api";
import { SafeAreaView } from "react-native";
import { AlphabetList } from "react-native-section-alphabet-list";
import { Colors } from "@/constants/Colors";
import { Avatar } from "@/components/Avatar";

// Define the props for EmployeeList component
type EmployeeProps = {
    employeeListVisible: boolean;
    setEmployeeListVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

// EmployeeList component to display a list of employees
const EmployeeList = ({
    employeeListVisible,
    setEmployeeListVisible,
}: EmployeeProps) => {
    const organization = useAppSelector(
        (state: RootState) => state.organization
    );

    // State variables to store employees, filtered employees, and the search query
    const [employees, setEmployees] = React.useState<any[]>([]);
    const [filteredEmployees, setFilteredEmployees] = React.useState<any[]>([]);
    const [searchQuery, setSearchQuery] = React.useState<string>("");

    // Fetch all employees for the selected organization
    useEffect(() => {
        let org = organization.abbreviation;

        api.get("/api/profile/profile-getAllUsers?org=" + org)
            .then((response) => {
                const res = response.data;
                let data = res.map((contact: any, index: number) => ({
                    value: `${contact.first_name} ${contact.last_name}`,
                    avatar: contact.avatar,
                    email: contact.email,
                    key: `${index}`,
                }));

                setEmployees(data);
                setFilteredEmployees(data);
            })
            .catch((error) => {
                alert(error);
            });
    }, [organization]);

    // Update filtered employees based on search query
    useEffect(() => {
        if (searchQuery === "") {
            setFilteredEmployees(employees); // Show all if search query is empty
        } else {
            const filtered = employees.filter((employee) =>
                employee.value.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredEmployees(filtered);
        }
    }, [searchQuery, employees]);

    // Header component with a back button and title
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

    // Function to handle search input changes
    const handleSearch = (text: string) => {
        setSearchQuery(text); // Update searchQuery state correctly
    };

    // SearchBar component
    const SearchBar = () => (
        <TextInput
            placeholder="Search Employees"
            placeholderTextColor="#999"
            clearButtonMode="always"
            style={styles.searchBar}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={true}
        />
    );



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
                <Header /> {/* Render header */}
                <SearchBar /> {/* Render search bar */}
                <AlphabetList
                    data={filteredEmployees}
                    stickySectionHeadersEnabled
                    indexLetterStyle={{
                        color: Colors.primary,
                        fontSize: 12,
                    }}
                    indexContainerStyle={{
                        width: 24,
                        backgroundColor: Colors.background,
                    }}
                    // Render each employee item with avatar and details
                    renderCustomItem={(item: any) => (
                        <View style={styles.listItemContainer}>
                            <Avatar img={item.avatar} name={item.value} size={30} />
                            <View>
                                <Text style={{ color: "#000", fontSize: 14 }}>
                                    {item.value}
                                </Text>
                                <Text
                                    style={{
                                        color: Colors.gray,
                                        fontSize: 12,
                                    }}
                                >
                                    {item.email}
                                </Text>
                            </View>
                        </View>
                    )}
                    // Render section headers (alphabet letters)
                    renderCustomSectionHeader={(section) => (
                        <View style={styles.sectionHeaderContainer}>
                            <Text style={{ color: Colors.gray }}>
                                {section.title}
                            </Text>
                        </View>
                    )}
                    style={{ flex: 1 }}
                />
            </SafeAreaView>
        </Modal>
    );
};

export default EmployeeList;

//Style
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    searchBar: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderColor: "#ccc",
        borderWidth: 1,
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
        marginTop: 12,
        paddingLeft: 24,
    },
    sectionHeaderContainer: {
        height: 30,
        backgroundColor: Colors.background,
        justifyContent: "center",
        paddingHorizontal: 14,
    },
    listItemContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        height: 50,
        paddingHorizontal: 14,
        backgroundColor: "#fff",
    },
});