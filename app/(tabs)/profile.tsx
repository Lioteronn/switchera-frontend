import React from "react";
import { ScrollView, View, StyleSheet, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import ProfileInfo from "@/components/profileInfo";
import Achievements from "@/components/profileAchievements";
import ProfileSkillInfo from "@/components/profileSkillInfo";
import ProfileStats from "@/components/profileStats";
import UpcomingClassesPastClasses from "@/components/coming-pastClasses";
import ProfileFriends from "@/components/profileFriends";
import ProfileInterestTab from "@/components/profileInterestTab";
import { Feather } from "@expo/vector-icons";
import { Button } from "@gluestack-ui/themed";

type FilterKey =
    | "music"
    | "languages"
    | "programming"
    | "arts"
    | "cooking"
    | "beginner"
    | "intermediate"
    | "advanced"
    | "weekdays"
    | "weekends"
    | "evenings";

export default function Profile() {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1200;
    const router = useRouter();

    const [filters, setFilters] = React.useState<Record<FilterKey, boolean>>({
        music: false,
        languages: false,
        programming: false,
        arts: false,
        cooking: false,
        beginner: false,
        intermediate: false,
        advanced: false,
        weekdays: false,
        weekends: false,
        evenings: false,
    });

    const stats = { classesCompleted: 12, classesTaken: 17, averageRating: 4.8 };

    const badges = [
        { icon: "music" as keyof typeof Feather.glyphMap, label: "Guitarra" },
        { icon: "music" as keyof typeof Feather.glyphMap, label: "Piano" },
        { icon: "code" as keyof typeof Feather.glyphMap, label: "Código" },
    ];

    const achievements = [
        { label: "Bronce", color: "#b45309", description: "Clases impartidas", value: "5/10", progress: 50 },
        { label: "Plata", color: "#9ca3af", description: "Clases tomadas", value: "8/10", progress: 80, textColor: "#222" },
        { label: "Oro", color: "#facc15", description: "Top Rated", value: "75/100", progress: 75, textColor: "#222" },
        { label: "Diamante", color: "#06b6d4", description: "Popularidad", value: "25/100", progress: 25, textColor: "#fff" },
    ];

    if (!isDesktop) {

        return (
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
                <ProfileInfo
                    name="John Doe"
                    description="Profesor de guitarra y entusiasta del código"
                    avatarUrl="https://ui-avatars.com/api/?name=John+Doe"
                    isPremium
                    badges={badges}
                    stats={stats}
                    social={{
                        instagram: "#",
                        youtube: "#",
                        twitter: "#",
                        linkedin: "#",
                    }}
                />
                <Achievements achievements={achievements} onViewAll={() => {}} />
                <ProfileSkillInfo />
                <ProfileStats />
                <UpcomingClassesPastClasses />
                <ProfileInterestTab />
                <ProfileFriends />
                <Button onPress={() => router.push("/../components/room")}>
                    Ver Sala
                </Button>
            </ScrollView>
        );
    }

    // Escritorio: tres columnas
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {/* Izquierda */}
                <View style={styles.leftColumn}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}>
                        <ProfileInfo
                            name="John Doe"
                            description="Profesor de guitarra y entusiasta del código"
                            avatarUrl="https://ui-avatars.com/api/?name=John+Doe"
                            isPremium
                            badges={badges}
                            stats={stats}
                            social={{
                                instagram: "#",
                                youtube: "#",
                                twitter: "#",
                                linkedin: "#",
                            }}
                        />
                        <Achievements achievements={achievements} onViewAll={() => {}} />
                        <ProfileSkillInfo />
                    </ScrollView>
                </View>
                {/* Centro */}
                <View style={styles.centerColumn}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                        <Button onPress={() => router.push("/../components/room")}>
                            Ver Sala
                        </Button>
                        <ProfileStats />
                        <UpcomingClassesPastClasses />
                        <ProfileInterestTab />
                    </ScrollView>
                </View>
                {/* Derecha */}
                <View style={styles.rightColumn}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                        <ProfileFriends />
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
        padding: 16,
    },
    row: {
        flexDirection: "row",
        width: "100%",
        flex: 1,
    },
    leftColumn: {
        flex: 1,
        maxWidth: 320,
        minWidth: 220,
        paddingRight: 12,
        height: "100%",
    },
    centerColumn: {
        flex: 2,
        maxWidth: 900,
        minWidth: 250,
        paddingLeft: 6,
        paddingRight: 6,
        height: "100%",
    },
    rightColumn: {
        flex: 1,
        maxWidth: 320,
        minWidth: 220,
        paddingLeft: 12,
        height: "100%",
        flexShrink: 1,
    },
});