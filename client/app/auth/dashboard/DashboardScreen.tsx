import api from "@/apis/api"; // Import the API instance for making HTTP requests
import { useAppDispatch, useAppSelector } from "@/store/hooks"; // Import Redux hooks
import { RootState } from "@/store/store"; // Import the RootState type
import React, { useEffect, useMemo, useState } from "react"; // Import React and hooks
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Text,
    ScrollView,
    RefreshControl,
    Button,
    Modal,
    TouchableOpacity,
} from "react-native"; // Import React Native components
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons
import moment from "moment"; // Import Moment.js for date manipulation
import { logout } from "@/apis/authorize/login"; // Import logout API
import { userLogout } from "@/store/slices/userSlice"; // Import Redux action to update user state
import { router } from "expo-router"; // Import Expo router for navigation
import { updateOrganization } from "@/store/slices/organizationSlice"; // Import Redux action for organization state


// Define the tabs for days of the week
const tabs = [
    { name: "Mon" },
    { name: "Tue" },
    { name: "Wed" },
    { name: "Thu" },
    { name: "Fri" },
    { name: "Sat" },
    { name: "Sun" },
];


// Define the type for shift details
type DetailType = {
    date: string;
    shiftStart: string;
    shiftEnd: string;
    role: string;
    location: string;
    upcomingEvent?: {
        time: string;
        attendees: string;
        description: string;
    };
};


// Initialize sample shift details with default values
let sampleDetails: any = Array.from({ length: 7 }, () => ({
    date: "",
    shiftStart: "N/A",
    shiftEnd: "N/A",
    role: "N/A",
    location: "N/A",
    upcomingEvent: null,
}));


// Function to format time strings into a readable format
const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // Adjust for 12 AM/PM
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutesStr + " " + ampm;
    return strTime;
};


// Main component for the dashboard screen
export default function DashboardScreen() {
    // Access user and organization state from Redux store
    const user = useAppSelector((state: RootState) => state.user);
    const organization = useAppSelector((state: RootState) => state.organization);
    const dispatch = useAppDispatch();

    // State variables
    const [selectedIndex, setSelectedIndex] = useState((new Date().getDay() + 6) % 7); // Index of the selected day
    const [shiftDetail, setShiftDetail] = useState(sampleDetails); // Shift details for the week
    const [refreshing, setRefreshing] = useState(false); // Refresh control state
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility state


    const selectedDetails = shiftDetail[selectedIndex]; // Details of the currently selected day


    // Generate an array of dates for the current week starting from Monday
    const daysOfWeek = useMemo(
        () =>
            Array.from({ length: 7 }, (v, i) =>
                moment().startOf("isoWeek").add(i, "days").format("YYYY-MM-DD")
            ),
        []
    );


    // Fetch shift details from the API
    const fetchShiftDetails = () => {
        api.get(`/api/dashboard/get-detail-shift?orgAbbr=${organization.abbreviation}`)
            .then((res) => {
                const data = res.data;
                let newShiftDetail = sampleDetails.map((detail:any) => ({
                    ...detail,
                }));


                // Set the dates for the shift details
                for (let i = 0; i < 7; i++) {
                    newShiftDetail[i].date = daysOfWeek[i];
                }


                // Update shift details with data from the API
                data.forEach((d: any) => {
                    const shiftDate = moment(d.start_time).format("YYYY-MM-DD");
                    for (let i = 0; i < 7; i++) {
                        if (shiftDate === newShiftDetail[i].date) {
                            newShiftDetail[i].shiftStart = d.start_time;
                            newShiftDetail[i].shiftEnd = d.end_time;
                            newShiftDetail[i].location = d.organization_name;
                            newShiftDetail[i].role = d.role_name;
                        }
                    }
                });


                // Add sample upcoming events (for demo purposes)
                newShiftDetail[2].upcomingEvent = {
                    time: "6:00 PM",
                    attendees: "30 Guests",
                    description:
                        "John's Birthday Party\nSet Menu: #4\nBeverages: Open\nBar: None\nNote: Birthday cake at the end",
                };
                newShiftDetail[3].upcomingEvent = {
                    time: "7:30 PM",
                    attendees: "45 Guests",
                    description:
                        "Tim's Family Reunion\nSet Menu: #1\nBeverages: Open\nBar: Open\nNote: 10 more guests will come at 8:30",
                };
                newShiftDetail[4].upcomingEvent = {
                    time: "8:00 PM",
                    attendees: "70 Guests",
                    description:
                        "Emily's Graduation Party\nSet Menu: #12\nBeverages: Open\nBar: Open\nNote: Set up dessert station, clear out 2 tables for the gifts",
                };
                newShiftDetail[5].upcomingEvent = {
                    time: "5:30 PM",
                    attendees: "50 Guests",
                    description:
                        "GARACO Party\nSet Menu: #8\nBeverages: Open\nBar: Open\nNote: Company meetup, try not to interrupt CEO's presentation",
                };


                setShiftDetail(newShiftDetail); // Update state with new shift details
                setRefreshing(false); // Stop the refresh indicator


                // Reset selected index to the current day
                setSelectedIndex((new Date().getDay() + 6) % 7);
            })
            .catch((error) => {
                console.error("Error fetching shift details:", error);
                setRefreshing(false); // Stop the refresh indicator on error
            });
    };


    // Fetch shift details on component mount
    useEffect(() => {
        fetchShiftDetails();
    }, []);


    // Handle pull-to-refresh action
    const onRefresh = () => {
        setRefreshing(true);
        fetchShiftDetails();
    };


    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#4338ca" // iOS spinner color
                        title="Loading..." // Text below the spinner
                        titleColor="#4338ca" // Text color
                        colors={["#4338ca"]} // Android spinner colors
                        progressBackgroundColor="#e0e7ff" // Spinner background color
                    />
                }
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {/* Header Text */}
                <Text style={styles.textHeader}>Your upcoming schedules:</Text>


                {/* Tabs for days of the week */}
                <View style={styles.container}>
                    {tabs.map((item, index) => {
                        const isActive = index === selectedIndex; // Check if the tab is active


                        return (
                            <View key={item.name} style={{ flex: 1 }}>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        setSelectedIndex(index); // Update selected day index
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.item,
                                            isActive && { backgroundColor: "#e0e7ff" }, // Highlight active tab
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.text,
                                                isActive && { color: "#4338ca" }, // Highlight active tab text
                                            ]}
                                        >
                                            {item.name}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        );
                    })}
                </View>


                {/* Shift and event details */}
                <View style={styles.detailsWrapper}>
                    <View style={styles.detailsContainer}>
                        {/* Shift Date */}
                        <View style={styles.detailRow}>
                            <Icon name="calendar" size={20} color="#4b5563" />
                            <Text style={styles.detailsText}>
                                {moment(selectedDetails.date, "YYYY-MM-DD").format("MM/DD/YYYY")}
                            </Text>
                        </View>


                        {/* Shift Time */}
                        <View style={styles.detailRow}>
                            <Icon name="clock-o" size={20} color="#4b5563" />
                            <Text style={styles.detailsText}>
                                {selectedDetails.shiftStart !== "N/A"
                                    ? `${formatTime(selectedDetails.shiftStart)} - ${formatTime(
                                        selectedDetails.shiftEnd
                                    )}`
                                    : "N/A"}
                            </Text>
                        </View>


                        {/* Role */}
                        <View style={styles.detailRow}>
                            <Icon name="user" size={20} color="#4b5563" />
                            <Text style={styles.detailsText}>{selectedDetails.role}</Text>
                        </View>


                        {/* Location */}
                        <View style={styles.detailRow}>
                            <Icon name="map-marker" size={20} color="#4b5563" />
                            <Text style={styles.detailsText}>{selectedDetails.location}</Text>
                        </View>


                        {/* Divider */}
                        <View style={styles.sectionDivider} />


                        {/* Upcoming Event Section */}
                        <Text style={styles.sectionHeaderText}>Upcoming Event:</Text>
                        {selectedDetails.upcomingEvent ? (
                            <>
                                {/* Event Time */}
                                <View style={styles.detailRow}>
                                    <Icon name="clock-o" size={20} color="#4b5563" />
                                    <Text style={styles.detailsText}>
                                        {selectedDetails.upcomingEvent.time}
                                    </Text>
                                </View>


                                {/* Attendees */}
                                <View style={styles.detailRow}>
                                    <Icon name="users" size={20} color="#4b5563" />
                                    <Text style={styles.detailsText}>
                                        {selectedDetails.upcomingEvent.attendees}
                                    </Text>
                                </View>


                                {/* View Details Button */}
                                <TouchableOpacity
                                    style={styles.viewButton}
                                    onPress={() => setModalVisible(true)}
                                >
                                    <Text style={styles.viewButtonText}>View</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            // No Upcoming Events
                            <View style={styles.detailRow}>
                                <Icon name="calendar-times-o" size={20} color="#4b5563" />
                                <Text style={styles.detailsText}>No upcoming events</Text>
                            </View>
                        )}
                    </View>
                </View>


                {/* Logout Button */}
                <Button
                    title="Logout"
                    onPress={() => {
                        logout(); // Call logout API
                        dispatch(userLogout()); // Update Redux state
                        router.replace(""); // Navigate back to the login screen
                    }}
                />
            </ScrollView>


            {/* Modal for Event Details */}
            {selectedDetails.upcomingEvent && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            {/* Modal Title */}
                            <Text style={styles.modalTitle}>Event Details</Text>


                            {/* Event Time */}
                            <Text style={styles.modalText}>
                                Time: {selectedDetails.upcomingEvent.time}
                            </Text>


                            {/* Event Attendees */}
                            <Text style={styles.modalText}>
                                Attendees: {selectedDetails.upcomingEvent.attendees}
                            </Text>


                            {/* Event Description */}
                            <Text style={styles.modalText}>
                                Description: {selectedDetails.upcomingEvent.description}
                            </Text>


                            {/* Close Button */}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}


// Stylesheet for the component
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "white",
        paddingVertical: 24,
        paddingHorizontal: 12,
    },
    item: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        backgroundColor: "transparent",
        borderRadius: 6,
    },
    text: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6b7280",
    },
    textHeader: {
        fontSize: 25,
        fontWeight: "600",
        color: "black",
        textAlign: "center",
        marginVertical: 20,
    },
    detailsWrapper: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 20,
    },
    detailsContainer: {
        padding: 20,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        width: "90%",
    },
    detailsText: {
        fontSize: 16,
        color: "#4b5563",
        marginLeft: 10,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    sectionDivider: {
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        marginVertical: 10,
    },
    sectionHeaderText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#4b5563",
        marginBottom: 10,
    },
    viewButton: {
        backgroundColor: "#4338ca",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: "flex-start",
        marginTop: 10,
    },
    viewButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: "#4338ca",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
