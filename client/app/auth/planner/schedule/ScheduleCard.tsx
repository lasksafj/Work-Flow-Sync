import React, { useEffect, useState, useRef } from 'react';
import {
    Alert,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Modal,
    TextInput,
    ScrollView,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Import DateTimePickerModal for date selection
import { Avatar } from '@/components/Avatar'; // Custom Avatar component
import { useAppSelector } from '@/store/hooks'; // Hook to access Redux store
import { RootState } from '@/store/store'; // RootState type from Redux store
import { styles } from './ScheduleCard.styles'; // Styles for the component
import api from '@/apis/api'; // API utility for making HTTP requests

// Get device screen width for responsive design
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// {QUY} Define the Employee interface to type employee objects
interface Employee {
    first_name: string;
    last_name: string;
    id: number;
    schedule_role: string;
    start_time: string;
    end_time: string;
}

// ScheduleCard component definition
const ScheduleCard = (props: any) => {
    // Access the current user from the Redux store
    const user = useAppSelector((state: RootState) => state.user);

    // {QUY} State variables
    const [userSchedule, setUserSchedule] = useState(props.detail); // Current schedule details
    const [detailScreen, setDetailScreen] = useState(false); // Visibility of the detail modal
    const [reasonScreen, setReasonScreen] = useState(false); // Visibility of the reason input modal
    const [reasonText, setReasonText] = useState(''); // Text input for the reason
    const [isSwap, setIsSwap] = useState(false); // Flag to indicate if it's a swap request
    const [isPast, setIsPast] = useState(false); // Flag to indicate if the shift is in the past
    const [selectedSwapEmployee, setSelectedSwapEmployee] = useState<Employee>(); // Selected employee for swap
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // Visibility of the date picker modal
    const [selectedDate, setSelectedDate] = useState(''); // Date selected for swap

    // Convert start and end times to Date objects
    const start = new Date(userSchedule.start_time);
    const end = new Date(userSchedule.end_time);

    // Animated value for touch feedback
    const animatedValue = useRef(new Animated.Value(1)).current;

    // {QUY} State to hold employee details for a specific date
    const [dateDetails, setDateDetails] = useState<Employee[]>([]);

    // {QUY} State to control the visibility of the swap employees modal
    const [modalSwapEmployees, setModalSwapEmployees] = useState(false);

    // Update userSchedule state when props.detail changes
    useEffect(() => {
        setUserSchedule(props.detail);
    }, [props.detail]);

    /**
     * {QUY} Fetch the list of employees available on a specific date for swapping shifts
     * @param date - The selected date for which to fetch employee details
     */
    const handleEmployeesList = (date: string) => {
        console.log(props.detail.abbreviation, date, props.detail.id);
        api.get(`/api/request/get-date-details?abbreviation=${props.detail.abbreviation}&date=${date}&employee_number=${props.detail.employee_number}`)
            .then((res) => {
                console.log(res.data);
                setDateDetails(res.data);
                setModalSwapEmployees(true);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                Alert.alert('Error', 'Failed to fetch employees. Please try again.');
            });
    };

    /**
     * Handle the press in animation for the TouchableOpacity
     */
    const handlePressIn = () => {
        Animated.spring(animatedValue, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    /**
     * Handle the press out animation to return to original scale
     */
    const handlePressOut = () => {
        Animated.spring(animatedValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    /**
     * Convert a Date object to a formatted time string (HH:MM)
     */
    const dateToTime = (date_time: any) => {
        let hours = date_time.getHours().toString().padStart(2, '0');
        let minutes = date_time.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    /**
     * Calculate the working hours between start and end times
     */
    const workingHours = (start: any, end: any) => {
        let diff = (end - start) / 1000 / 60; // Difference in minutes
        let hours = Math.floor(diff / 60);
        let minutes = diff % 60;
        let formattedHours = hours.toString().padStart(2, '0');
        let formattedMinutes = minutes.toString().padStart(2, '0');

        return `${formattedHours} hr-${formattedMinutes} min`;
    };

    /**
     * {QUY} Handle the action to drop a shift by showing the reason input modal
     */
    const handleDropShift = () => {
        setIsSwap(false);
        setReasonScreen(true);
    };

    /**
     * {QUY} Handle the action to swap a shift by showing the date picker
     */
    const handleSwapShift = () => {
        setDatePickerVisibility(true);
    };

    /**
     * {QUY} Handle date selection from the date picker
     */
    const handleConfirm = (date: Date) => {
        setIsSwap(true); // Set to swap shift mode
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        console.log('Selected date:', formattedDate);
        setSelectedDate(formattedDate);
        setDatePickerVisibility(false);

        setTimeout(() => {
            handleEmployeesList(formattedDate);
        }, 500);
    };

    /**
     * {QUY} Hide the date picker modal without selecting a date
     */
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    /**
     * {QUY} Submit the reason for dropping a shift
     */
    const handleSubmitReasonDrop = async () => {
        console.log('Reason submitted:', reasonText);
        if (!reasonText.trim()) {
            Alert.alert('Validation Error', 'Reason is required.');
            return;
        }

        try {
            const res = await api.post('/api/request/create-drop-request', {
                abbreviation: props.detail.abbreviation,
                schedule_id: props.detail.schedule_id,
                status: 'Pending',
                reason: reasonText,
            });

            const confrimNotification = res.data;
            Alert.alert(
                'Request Submitted',
                `Your request has been successfully submitted with the reason: "${confrimNotification.reason}".`,
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
            );

            setReasonText(''); // Clear the reason text
            setReasonScreen(false); // Hide the reason input modal
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'An unexpected error occurred. Please try again.';
            Alert.alert('Submission Error', errorMessage);
        }
    };

    /**
     * {QUY} Submit the reason and selected employee for swapping a shift
     */
    const handleSubmitSwapShift = async () => {
        console.log('Swap submitted:', reasonText);
        if (!reasonText.trim()) {
            Alert.alert('Validation Error', 'Reason is required.');
            return;
        }

        try {
            const res = await api.post('/api/request/create-swap-request', {
                abbreviation: props.detail.abbreviation,
                schedule_id: props.detail.schedule_id,
                status: 'Pending',
                reason: reasonText,
                swapEmployeeId: selectedSwapEmployee?.id,
            });

            const confrimNotification = res.data;
            Alert.alert(
                'Request Submitted',
                `Your swap request has been successfully submitted with the reason: "${confrimNotification.request.reason}".
                \nWith Employee: ${selectedSwapEmployee?.first_name} ${selectedSwapEmployee?.last_name}`,
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
            );

            setReasonText(''); // Clear the reason text
            setReasonScreen(false); // Hide the reason input modal
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'An unexpected error occurred. Please try again.';
            Alert.alert('Submission Error', errorMessage);
        }
    };

    /**
     * {QUY} Check if the shift date is in the past to determine button visibility
     */
    const dayCheck = () => {
        const currentDate = new Date();
        const shiftDate = new Date(props.detail.start_time);

        // Compare only the date parts
        const isPastShift = shiftDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0);

        if (!isPastShift) {
            setIsPast(true); // Shift is not in the past
        } else {
            setIsPast(false); // Shift is in the past
        }
    };

    return (
        <>
            {/* Touchable card representing the schedule */}
            <TouchableOpacity
                onPress={() => {
                    if (user.profile.phoneNumber === userSchedule.phone_number)
                        setDetailScreen(true); // Show detail modal if the user owns the schedule
                    dayCheck(); // Check if the shift is in the past
                }}
                onPressIn={handlePressIn} // Handle press in animation
                onPressOut={handlePressOut} // Handle press out animation
                style={styles.container}
            >
                {/* Animated view for touch feedback */}
                <Animated.View
                    style={[styles.block, { transform: [{ scale: animatedValue }] }]}
                >
                    {/* Avatar Section */}
                    <View style={styles.first}>
                        <Avatar
                            img={userSchedule.avatar}
                            name={`${userSchedule.first_name} ${userSchedule.last_name}`}
                            size={50}
                        />
                    </View>

                    {/* Employee Name and Working Hours */}
                    <View style={styles.second}>
                        <Text style={styles.secondTextPrimary}>
                            {userSchedule.first_name} {userSchedule.last_name}
                        </Text>
                        <Text style={styles.secondTextSecondary}>
                            {workingHours(start, end)}
                        </Text>
                    </View>

                    {/* Shift Start and End Times */}
                    <View style={styles.third}>
                        <View style={styles.timeRow}>
                            <Icon name="access-time" size={20} color="#2980B9" />
                            <Text style={styles.timeText}>{dateToTime(start)}</Text>
                        </View>
                        <View style={styles.timeRow}>
                            <Icon name="access-time" size={20} color="#E74C3C" />
                            <Text style={styles.timeText}>{dateToTime(end)}</Text>
                        </View>
                    </View>
                </Animated.View>
            </TouchableOpacity>



            {/* Modal for displaying shift details */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={detailScreen}
                onRequestClose={() => setDetailScreen(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Shift Details</Text>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.secondTextPrimary}>
                                Workplace: {userSchedule.name}
                            </Text>
                            <Text style={styles.secondTextPrimary}>
                                {userSchedule.first_name} {userSchedule.last_name}
                            </Text>
                            <Text style={styles.secondTextPrimary}>
                                Role: {userSchedule.role}
                            </Text>
                            <Text style={styles.secondTextPrimary}>
                                Time: {dateToTime(start)} - {dateToTime(end)}
                            </Text>
                        </View>

                        {/* Buttons Row: Show drop and swap buttons if the shift is not in the past */}
                        {isPast ? (
                            <>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        onPress={handleDropShift}
                                        style={styles.modalButton}
                                    >
                                        <Text style={styles.modalButtonText}>Drop Shift</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleSwapShift}
                                        style={styles.modalButton}
                                    >
                                        <Text style={styles.modalButtonText}>Swap Shift</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Close button */}
                                <View style={styles.closeButtonContainer}>
                                    <TouchableOpacity
                                        onPress={() => setDetailScreen(false)}
                                        style={[styles.closeButton, { backgroundColor: '#7F8C8D' }]}
                                    >
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>

                            </>
                        ) : (
                            // If the shift is in the past, only show the close button
                            <View style={styles.closeButtonContainer}>
                                <TouchableOpacity
                                    onPress={() => setDetailScreen(false)}
                                    style={styles.closeButton}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Modal for displaying employees available for swap on selected date */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalSwapEmployees}
                        onRequestClose={() => setModalSwapEmployees(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Employees List on {selectedDate}</Text>
                                <ScrollView style={styles.table}>
                                    {dateDetails.length > 0 ? (
                                        dateDetails.map((item: Employee, index) => (
                                            <View key={index} style={styles.tableRow}>
                                                {/* Button to select an employee for swapping */}
                                                <TouchableOpacity
                                                    style={styles.selectButton}
                                                    onPress={() => {
                                                        console.log(`Selected Employee: ${item.first_name} ${item.last_name}`);
                                                        console.log(`Selected Employee_Id: ${item.id}`);
                                                        console.log(`Selected Roles: ${item.schedule_role}`);
                                                        setSelectedSwapEmployee(item); // Set the selected employee
                                                        setIsSwap(true); // Set to swap mode
                                                        setModalSwapEmployees(false); // Close the swap employees modal
                                                        setReasonScreen(true); // Show reason input modal
                                                    }}
                                                >
                                                    <Text style={styles.selectButtonText}>Select</Text>
                                                </TouchableOpacity>
                                                {/* Display employee details */}
                                                <Text style={styles.tableCell}>
                                                    {item.first_name} {item.last_name}
                                                </Text>
                                                <Text style={styles.tableCell}>{item.schedule_role}</Text>
                                                <Text style={styles.tableCell}>
                                                    {new Date(item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(item.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text style={styles.loadingText}>No employees available for this date.</Text>
                                    )}
                                </ScrollView>
                                {/* Button to close the swap employees modal */}
                                <TouchableOpacity
                                    onPress={() => setModalSwapEmployees(false)}
                                    style={styles.closeButton}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </Modal>

                    {/* Modal for inputting reason for dropping or swapping a shift */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={reasonScreen}
                        onRequestClose={() => setReasonScreen(false)}
                    >
                        <View style={styles.reasonModalContainer}>
                            <View style={styles.reasonModalContent}>
                                <Text style={styles.modalTitle}>{isSwap ? 'Swap Shift Reason' : 'Drop Shift Reason'}</Text>
                                {/* Text input for the reason */}
                                <TextInput
                                    style={styles.reasonInput}
                                    multiline
                                    numberOfLines={4}
                                    onChangeText={(text) => setReasonText(text)}
                                    value={reasonText}
                                    placeholder="Type your reason here..."
                                    placeholderTextColor="#95A5A6"
                                />
                                <View style={styles.reasonButtonContainer}>
                                    {/* Submit button: changes based on whether it's a swap or drop */}
                                    {!isSwap ? (
                                        <TouchableOpacity
                                            onPress={handleSubmitReasonDrop}
                                            style={[styles.reasonModalButton, { backgroundColor: '#27AE60' }]}
                                        >
                                            <Text style={styles.reasonModalButtonText}>
                                                Submit Request
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={handleSubmitSwapShift}
                                            style={[styles.reasonModalButton, { backgroundColor: '#2980B9' }]}
                                        >
                                            <Text style={styles.reasonModalButtonText}>
                                                Request Swap
                                            </Text>
                                        </TouchableOpacity>
                                    )}

                                    {/* Cancel button to close the reason input modal */}
                                    <TouchableOpacity
                                        onPress={() => setReasonScreen(false)}
                                        style={[styles.reasonModalButton, { backgroundColor: '#E74C3C' }]}
                                    >
                                        <Text style={styles.reasonModalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>



                        </View>
                    </Modal>

                    {/* Date Picker Modal for selecting a date to swap the shift */}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />

                </View>
            </Modal>
        </>
    )
};

export default ScheduleCard;
