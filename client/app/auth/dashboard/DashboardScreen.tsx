import api from "@/apis/api";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import React, { useEffect, useMemo, useState } from "react";
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Text,
    ScrollView,
    RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";

const tabs = [
    { name: "Mon" },
    { name: "Tue" },
    { name: "Wed" },
    { name: "Thu" },
    { name: "Fri" },
    { name: "Sat" },
    { name: "Sun" },
];

type DetailType = {
    date: string;
    shiftStart: string;
    shiftEnd: string;
    role: string;
    location: string;
    upcomingEvent: { time: string; attendees: string };
};

let sampleDetails: DetailType[] = Array.from({ length: 7 }, () => ({
    date: "",
    shiftStart: "N/A",
    shiftEnd: "N/A",
    role: "N/A",
    location: "N/A",
    upcomingEvent: { time: "N/A", attendees: "N/A" },
}));

const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutesStr + " " + ampm;
    return strTime;
};

export default function DashboardScreen() {
    const user = useAppSelector((state: RootState) => state.user);
    const organization = useAppSelector((state: RootState) => state.organization);

    // Adjust selectedIndex to match the week starting on Monday
    const [selectedIndex, setSelectedIndex] = React.useState((new Date().getDay() + 6) % 7);
    const [shiftDetail, setShiftDetail] = useState(sampleDetails);
    const [refreshing, setRefreshing] = useState(false);

    const selectedDetails = shiftDetail[selectedIndex];

    // Generate daysOfWeek starting from Monday
    const daysOfWeek = useMemo(
        () =>
            Array.from({ length: 7 }, (v, i) =>
                moment().startOf("isoWeek").add(i, "days").format("YYYY-MM-DD")
            ),
        []
    );

    const fetchShiftDetails = () => {
        api.get(`/api/dashboard/get-detail-shift?orgAbbr=${organization.abbreviation}`)
            .then((res) => {
                const data = res.data;
                let newShiftDetail = sampleDetails.map((detail) => ({
                    ...detail,
                }));

                // Set the dates for the shift details
                for (let i = 0; i < 7; i++) {
                    newShiftDetail[i].date = daysOfWeek[i];
                }

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

                setShiftDetail(newShiftDetail);
                setRefreshing(false);
            })
            .catch((error) => {
                console.error("Error fetching shift details:", error);
                setRefreshing(false);
            });
    };

    useEffect(() => {
        fetchShiftDetails();
    }, []);

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
                        tintColor="#4338ca" // Spinner color for iOS
                        title="Loading..." // Text below the spinner
                        titleColor="#4338ca" // Text color
                        colors={["#4338ca"]} // Spinner color for Android
                        progressBackgroundColor="#e0e7ff" // Background color of the spinner
                    />
                }
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <Text style={styles.textHeader}>Your upcoming schedules:</Text>

                <View style={styles.container}>
                    {tabs.map((item, index) => {
                        const isActive = index === selectedIndex;

                        return (
                            <View key={item.name} style={{ flex: 1 }}>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        setSelectedIndex(index);
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.item,
                                            isActive && { backgroundColor: "#e0e7ff" },
                                        ]}
                                    >
                                        <Text
                                            style={[styles.text, isActive && { color: "#4338ca" }]}
                                        >
                                            {item.name}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        );
                    })}
                </View>

                <View style={styles.detailsWrapper}>
                    <View style={styles.detailsContainer}>
                        <View style={styles.detailRow}>
                            <Icon name="calendar" size={20} color="#4b5563" />
                            <Text style={styles.detailsText}>
                                {moment(selectedDetails.date, "YYYY-MM-DD").format("DD/MM/YYYY")}
                            </Text>
                        </View>
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
                        <View style={styles.detailRow}>
                            <Icon name="user" size={20} color="#4b5563" />
                            <Text style={styles.detailsText}>{selectedDetails.role}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Icon name="map-marker" size={20} color="#4b5563" />
                            <Text style={styles.detailsText}>{selectedDetails.location}</Text>
                        </View>
                        <View style={styles.sectionDivider} />
                        <Text style={styles.sectionHeaderText}>Upcoming event:</Text>
                        {selectedDetails.upcomingEvent ? (
                            <>
                                <View style={styles.detailRow}>
                                    <Icon name="clock-o" size={20} color="#4b5563" />
                                    <Text style={styles.detailsText}>
                                        {selectedDetails.upcomingEvent.time}
                                    </Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Icon name="users" size={20} color="#4b5563" />
                                    <Text style={styles.detailsText}>
                                        {selectedDetails.upcomingEvent.attendees}
                                    </Text>
                                </View>
                            </>
                        ) : (
                            <View style={styles.detailRow}>
                                <Icon name="calendar-times-o" size={20} color="#4b5563" />
                                <Text style={styles.detailsText}>No upcoming events</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

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
});
