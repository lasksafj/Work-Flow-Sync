import { StyleSheet } from 'react-native';

// Stylesheet for the ScheduleCard component
export const styles = StyleSheet.create({
    // Container for the entire ScheduleCard
    container: {
        marginVertical: 8, // Vertical spacing between cards
        marginHorizontal: 12, // Horizontal spacing around the card
        padding: 12, // Inner padding within the card
        backgroundColor: '#FFFFFF', // White background color
        borderRadius: 12, // Rounded corners
        shadowColor: '#000', // Shadow color for iOS
        shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
        shadowOpacity: 0.1, // Shadow opacity for iOS
        shadowRadius: 4, // Shadow blur radius for iOS
        elevation: 3, // Shadow elevation for Android
    },

    // Block containing the avatar, name, and shift times
    block: {
        flexDirection: 'row', // Arrange children horizontally
        alignItems: 'center', // Vertically center the children
    },

    // First section: Avatar container
    first: {
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        width: '20%', // Occupies 20% of the horizontal space
    },

    // Second section: Employee name and working hours
    second: {
        paddingLeft: 10, // Left padding between avatar and text
        flex: 1, // Take up remaining horizontal space
        justifyContent: 'center', // Center vertically
    },

    // Primary text style for employee name
    secondTextPrimary: {
        fontSize: 18, // Font size
        fontWeight: '600', // Semi-bold font weight
        color: '#34495E', // Dark blue-gray color
    },

    // Secondary text style for working hours
    secondTextSecondary: {
        fontSize: 14, // Smaller font size
        fontWeight: '400', // Regular font weight
        color: '#7F8C8D', // Gray color
        marginTop: 4, // Small top margin
    },

    // Third section: Shift start and end times
    third: {
        flexDirection: 'column', // Arrange children vertically
        alignItems: 'flex-end', // Align children to the right
        width: '20%', // Occupies 20% of the horizontal space
    },

    // Row style for each time entry (start or end)
    timeRow: {
        flexDirection: 'row', // Arrange icon and text horizontally
        alignItems: 'center', // Vertically center the icon and text
        marginBottom: 4, // Small bottom margin between rows
    },

    // Text style for the shift time
    timeText: {
        fontSize: 14, // Font size
        fontWeight: '400', // Regular font weight
        color: '#2C3E50', // Dark slate color
        marginLeft: 4, // Space between icon and text
    },

    // Modal Styles
    // Container for modals to center content and apply backdrop
    modalContainer: {
        flex: 1, // Fill the entire screen
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
    },

    // Content box within the modal
    modalContent: {
        width: '90%', // Width relative to the screen
        backgroundColor: '#fff', // White background
        borderRadius: 12, // Rounded corners
        padding: 20, // Inner padding
        shadowColor: '#000', // Shadow color for iOS
        shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
        shadowOpacity: 0.2, // Shadow opacity for iOS
        shadowRadius: 4, // Shadow blur radius for iOS
        elevation: 5, // Shadow elevation for Android
    },

    // Title text within modals
    modalTitle: {
        fontSize: 20, // Larger font size
        fontWeight: '700', // Bold font weight
        color: '#2C3E50', // Dark slate color
        marginBottom: 15, // Space below the title
        textAlign: 'center', // Center the text
    },

    // Scrollable table within the swap employees modal
    table: {
        width: '100%', // Full width of the modal content
        marginBottom: 20, // Space below the table
    },

    // Each row within the table
    tableRow: {
        flexDirection: 'row', // Arrange cells horizontally
        alignItems: 'center', // Vertically center the cells
        paddingVertical: 10, // Vertical padding within the row
        borderBottomWidth: 1, // Bottom border for separation
        borderBottomColor: '#ECF0F1', // Light gray border color
    },

    // Each cell within a table row
    tableCell: {
        flex: 1, // Equal width for all cells
        textAlign: 'center', // Center the text horizontally
        fontSize: 14, // Font size
        color: '#34495E', // Dark blue-gray color
    },

    // Text displayed when loading or when no data is available
    loadingText: {
        fontSize: 16, // Font size
        color: '#7F8C8D', // Gray color
        textAlign: 'center', // Center the text
        marginVertical: 20, // Vertical margin
    },

    // Button style for selecting an employee in the swap modal
    selectButton: {
        paddingVertical: 6, // Vertical padding
        paddingHorizontal: 12, // Horizontal padding
        backgroundColor: '#2980B9', // Blue background color
        borderRadius: 6, // Rounded corners
        marginRight: 10, // Space to the right of the button
    },

    // Text style for the select button
    selectButtonText: {
        color: '#fff', // White text color
        fontSize: 14, // Font size
        textAlign: 'center', // Center the text
    },

    // Button style for closing modals
    closeButton: {
        paddingVertical: 10, // Vertical padding
        paddingHorizontal: 20, // Horizontal padding
        backgroundColor: '#E74C3C', // Red background color
        borderRadius: 6, // Rounded corners
        alignItems: 'center', // Center the text horizontally
        marginTop: 15, // Space above the button
    },

    // Text style for the close button
    closeButtonText: {
        color: '#fff', // White text color
        fontSize: 16, // Font size
        fontWeight: '600', // Semi-bold font weight
    },

    // Container for action buttons (Drop Shift and Swap Shift)
    buttonContainer: {
        flexDirection: 'row', // Arrange buttons horizontally
        justifyContent: 'space-between', // Space buttons evenly
        marginTop: 20, // Space above the buttons
    },

    // Style for each action button in the modal
    modalButton: {
        flex: 1, // Equal width for both buttons
        paddingVertical: 12, // Vertical padding
        marginHorizontal: 5, // Horizontal margin between buttons
        backgroundColor: '#27AE60', // Green background color
        borderRadius: 6, // Rounded corners
        alignItems: 'center', // Center the text horizontally
    },

    // Text style for action buttons
    modalButtonText: {
        color: '#fff', // White text color
        fontSize: 16, // Font size
        fontWeight: '600', // Semi-bold font weight
    },

    // Container for the close button in the detail modal
    closeButtonContainer: {
        alignItems: 'center', // Center the close button horizontally
        marginTop: 15, // Space above the close button
    },

    // Reason Input Modal Styles
    // Container for the reason input modal to center content and apply backdrop
    reasonModalContainer: {
        flex: 1, // Fill the entire screen
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black background
    },

    // Content box within the reason input modal
    reasonModalContent: {
        width: '85%', // Width relative to the screen
        backgroundColor: '#fff', // White background
        borderRadius: 12, // Rounded corners
        padding: 20, // Inner padding
        shadowColor: '#000', // Shadow color for iOS
        shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
        shadowOpacity: 0.3, // Shadow opacity for iOS
        shadowRadius: 4, // Shadow blur radius for iOS
        elevation: 5, // Shadow elevation for Android
    },

    // Text input field for entering the reason
    reasonInput: {
        width: '100%', // Full width of the modal content
        height: 100, // Fixed height for the input field
        borderColor: '#BDC3C7', // Light gray border color
        borderWidth: 1, // Border width
        borderRadius: 8, // Rounded corners
        padding: 12, // Inner padding
        textAlignVertical: 'top', // Align text to the top
        fontSize: 16, // Font size
        color: '#2C3E50', // Dark slate color for text
        marginBottom: 15, // Space below the input field
    },

    // Container for the reason modal buttons (Submit and Cancel)
    reasonButtonContainer: {
        flexDirection: 'row', // Arrange buttons horizontally
        justifyContent: 'space-between', // Space buttons evenly
    },

    // Style for the submit and cancel buttons in the reason modal
    reasonModalButton: {
        flex: 1, // Equal width for both buttons
        paddingVertical: 12, // Vertical padding
        marginHorizontal: 5, // Horizontal margin between buttons
        backgroundColor: '#2980B9', // Blue background color (overridden for specific buttons)
        borderRadius: 6, // Rounded corners
        alignItems: 'center', // Center the text horizontally
    },

    // Text style for the reason modal buttons
    reasonModalButtonText: {
        color: '#fff', // White text color
        fontSize: 16, // Font size
        fontWeight: '600', // Semi-bold font weight
    },
});
