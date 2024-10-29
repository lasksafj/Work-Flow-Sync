import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import ScheduleCard from './ScheduleCard';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import api from '@/apis/api';
import { FlatList } from 'react-native';

interface ScheduleDetailProps {
    detail: string;
    isExpanded: boolean;
    onPress: () => void;
}

const ScheduleDetail: React.FC<ScheduleDetailProps> = ({ detail, isExpanded, onPress }) => {
    const [listData, setListData] = useState<any[]>([]);
    const heightAnim = useState(new Animated.Value(0))[0];
    const organization = useAppSelector((state: RootState) => state.organization);

    useEffect(() => {
        let org = organization.abbreviation;
        let date = detail;

        const fetchData = async () => {
            try {
                const res = await api.get(`/api/schedule/schedule-get?org=${org}&&chosedate=${date}`);
                const data = res.data;
                setListData(data);

                Animated.timing(heightAnim, {
                    toValue: isExpanded ? 1 : 0,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            } catch (error) {
                alert(error);
            }
        };

        if (isExpanded && !listData.length) {
            fetchData();
        } else {
            Animated.timing(heightAnim, {
                toValue: isExpanded ? 1 : 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    }, [isExpanded, listData.length]);

    const dateConvert = (date: string | Date): string => {
        const objDate = new Date(date);
        const utcDate = new Date(objDate.getUTCFullYear(), objDate.getUTCMonth(), objDate.getUTCDate());
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        };
        return utcDate.toLocaleDateString('en-US', options);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress} style={styles.bar}>
                <Text style={styles.barText}>{dateConvert(detail)}</Text>
                {isExpanded ? (
                    <Ionicons name='chevron-up' size={20} color={"white"} />
                ) : (
                    <Ionicons name='chevron-down' size={20} color={"white"} />
                )}
            </TouchableOpacity>

            <Animated.View style={[styles.details, { opacity: heightAnim }]}>
                {isExpanded && (
                    listData.length !== 0 ? (
                        <FlatList
                            data={listData}
                            renderItem={({ item }) => <ScheduleCard detail={item} />}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'flex-start', height: 50 }}>
                            <Text style={{ fontSize: 20, fontWeight: '300', paddingLeft: 8 }}>
                                No Working Schedule
                            </Text>
                        </View>
                    )
                )}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 3,
    },
    bar: {
        backgroundColor: '#008000',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    barText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    details: {
        overflow: 'hidden',
        borderRadius: 5,
    },
});

export default ScheduleDetail;
