import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";

type Person = {
    id: string;
    name: string;
    occupation: string;
    mutualFriends: number;
    avatarUrl: string;
};

const suggested: Person[] = [
    { id: "1", name: "Emily Davis", occupation: "Piano Teacher", mutualFriends: 3, avatarUrl: "https://ui-avatars.com/api/?name=Emily+Davis" },
    { id: "2", name: "David Kim", occupation: "Korean Tutor", mutualFriends: 2, avatarUrl: "https://ui-avatars.com/api/?name=David+Kim" },
    { id: "3", name: "Maria Garcia", occupation: "Spanish Teacher", mutualFriends: 4, avatarUrl: "https://ui-avatars.com/api/?name=Maria+Garcia" },
];

const requests: Person[] = [
    { id: "4", name: "Robert Lee", occupation: "Violin Teacher", mutualFriends: 2, avatarUrl: "https://ui-avatars.com/api/?name=Robert+Lee" },
];

export default function ProfilePeopleYouMayKnow() {
    return (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>People You May Know</Text>
            {suggested.map(person => (
                <View key={person.id} style={styles.personRow}>
                    <Image source={{ uri: person.avatarUrl }} style={styles.avatar} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.name}>{person.name}</Text>
                        <Text style={styles.occupation}>{person.occupation}</Text>
                        <Text style={styles.mutual}>{person.mutualFriends} mutual friends</Text>
                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.profileBtn}>
                                <Text style={styles.profileBtnText}>Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.addBtn}>
                                <Text style={styles.addBtnText}>Add Friend</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}
            <TouchableOpacity style={styles.findMoreBtn}>
                <Text style={styles.findMoreBtnText}>Find More Friends</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Friend Requests</Text>
            {requests.map(person => (
                <View key={person.id} style={styles.personRow}>
                    <Image source={{ uri: person.avatarUrl }} style={styles.avatar} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.name}>{person.name}</Text>
                        <Text style={styles.occupation}>{person.occupation}</Text>
                        <Text style={styles.mutual}>{person.mutualFriends} mutual friends</Text>
                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.ignoreBtn}>
                                <Text style={styles.ignoreBtnText}>Ignore</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.acceptBtn}>
                                <Text style={styles.acceptBtnText}>Accept</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#22223b",
        marginBottom: 12,
    },
    personRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 18,
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        marginRight: 14,
        marginTop: 2,
    },
    name: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#22223b",
    },
    occupation: {
        fontSize: 13,
        color: "#6b7280",
        marginBottom: 2,
    },
    mutual: {
        fontSize: 12,
        color: "#2563eb",
        marginBottom: 6,
    },
    actionRow: {
        flexDirection: "row",
        gap: 8,
    },
    profileBtn: {
        backgroundColor: "#e5e7eb",
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginRight: 8,
    },
    profileBtnText: {
        color: "#22223b",
        fontWeight: "bold",
        fontSize: 13,
    },
    addBtn: {
        backgroundColor: "#2563eb",
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    addBtnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 13,
    },
    findMoreBtn: {
        backgroundColor: "#f1f5f9",
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: "center",
        marginTop: 4,
    },
    findMoreBtnText: {
        color: "#2563eb",
        fontWeight: "bold",
        fontSize: 14,
    },
    ignoreBtn: {
        backgroundColor: "#e5e7eb",
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginRight: 8,
    },
    ignoreBtnText: {
        color: "#22223b",
        fontWeight: "bold",
        fontSize: 13,
    },
    acceptBtn: {
        backgroundColor: "#2563eb",
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    acceptBtnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 13,
    },
});