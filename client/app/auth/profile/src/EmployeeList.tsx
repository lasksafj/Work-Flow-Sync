import React, { useEffect, useMemo } from "react";
import {
    StyleSheet,
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    TextInput,
    ScrollView,
} from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { Feather as FeatherIcon } from "@expo/vector-icons";
import api from "@/apis/api";
import { updateOrganization } from "@/store/slices/organizationSlice";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { all } from "axios";
import { id } from "inversify";
import ImageProfile from "./ImageProfile";

type EmployeeProps = {
    employeeListVisible: boolean;
    setEmployeeListVisible : React.Dispatch<React.SetStateAction<boolean>>;
};
const items = [
    {
        id: "1",
        img:"",
        firstName: "John",
        lastName:"Doe",
        role: ["Manager", "Server"],
    },
    {
        id: "2",
        img:"",
        firstName: "John",
        lastName:"Doe",
        role: ["Manager", "Server"],
    },
    {
        id: "3",
        img:"",
        firstName: "John",
        lastName:"Doe",
        role: ["Manager", "Server"],
    },
    {
        id: "4",
        img:"",
        firstName: "John",
        lastName:"Doe",
        role: ["Manager", "Server"],
    },
    {
        id: "5",
        img:"",
        firstName: "John",
        lastName:"Doe",
        role: ["Manager", "Server"],
    },
    {
        id: "6",
        img:"",
        firstName: "John",
        lastName:"Doe",
        role: ["Manager", "Server"],
    },
    ];

const EmployeeList = ({
    employeeListVisible,
    setEmployeeListVisible,
}:EmployeeProps) => {

    const Header = () => (
        <View style={styles.header}>
        <TouchableOpacity onPress={() => {
            setEmployeeListVisible(false);
        }}>
            <FeatherIcon
                name="chevron-left"
                size={25}
                color="white"
                style={styles.title}
            />
        </TouchableOpacity>
        <Text style={styles.title}>Employee List</Text>
        <Text style={styles.spacer}/>
    </View>
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
            <SafeAreaView style={{flex:1}}>
                <ScrollView>
                    <Header/>
                </ScrollView>
            </SafeAreaView>
        </Modal>

    );
}

export default EmployeeList;

const styles = StyleSheet.create({
    searchContent: {
        paddingLeft: 24,
    },
    
    header: {
        flexDirection: "row",
        paddingHorizontal: 10,
        // marginBottom: 8,
        backgroundColor: "#008000",
        justifyContent: "space-between",
        alignItems: "center",
    },
    spacer: {
        width: 25,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
        marginBottom: 6,
        marginTop: 6,
    },
    section: {
        marginTop:12,
        paddingLeft:24,
    },
    sectionTitle: {
        fontSize:20,
        fontWeight:"700",
        color:"#000",
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
});