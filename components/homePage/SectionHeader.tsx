import React from "react";
import { Text, View } from "react-native";

type SectionHeaderProps = {
    title: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
    <View
        style={{
            width: '100%',
            backgroundColor: '#2563eb',
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            paddingVertical: 16,
            paddingHorizontal: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.10,
            shadowRadius: 6,
            elevation: 4,
        }}
    >
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '500', textAlign: 'center' }}>
            {title}
        </Text>
    </View>
);

export default SectionHeader;
