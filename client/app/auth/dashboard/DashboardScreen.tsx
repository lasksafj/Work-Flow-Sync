import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import api from '@/apis/api';
import { logout } from '@/apis/authorize/login';
import { useAppDispatch } from '@/store/hooks';
import { userLogout } from '@/store/slices/userSlice';
import { router } from 'expo-router';

<<<<<<< Updated upstream
const DashboardScreen = () => {
    const dispatch = useAppDispatch();
=======
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

    // Initial selectedIndex set to current day
    const [selectedIndex, setSelectedIndex] = useState((new Date().getDay() + 6) % 7);
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

                // Update selectedIndex to the current day after refresh is complete
                setSelectedIndex((new Date().getDay() + 6) % 7);
            })
            .catch((error) => {
                console.error("Error fetching shift details:", error);
                setRefreshing(false);
            });
    };
>>>>>>> Stashed changes

    useEffect(() => {
        api.get('/api/user/protected?number=123987')
            .then((res) => {
                console.log('dashboard api get -----', res.data);
            })
            .catch(err => {
                console.log('dashboard api err----', err);
                if (err.unauthorized) {
                    alert('LOGOUT')
                    router.replace('');
                    logout();
                    dispatch(userLogout());
                }
            })
    }, []);

    return (
        <View>
            <Text>dashboard</Text>
        </View>
    )
}

export default DashboardScreen

const styles = StyleSheet.create({})