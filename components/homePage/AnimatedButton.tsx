import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type AnimatedButtonProps = {
    variant?: "primary" | "outline" | "solid";
    onPress?: () => void;
    children: React.ReactNode;
    style?: ViewStyle;
};

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    variant = "primary",
    onPress = () => {},
    children,
    style,
}) => {
    const [isPressed, setIsPressed] = React.useState(false);

    let buttonStyle;
    let textStyle;

    if (variant === "primary") {
        buttonStyle = [styles.primaryButton, isPressed && styles.primaryButtonPressed];
        textStyle = styles.primaryText;
    } else if (variant === "outline") {
        buttonStyle = [styles.outlineButton, isPressed && styles.outlineButtonPressed];
        textStyle = styles.outlineText;
    } else {
        // solid
        buttonStyle = [styles.solidButton, isPressed && styles.solidButtonPressed];
        textStyle = styles.solidText;
    }

    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            style={[buttonStyle, style]}
        >
            <Text style={textStyle}>
                {children}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    primaryButton: {
        backgroundColor: "#007bff",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
    },
    primaryButtonPressed: {
        backgroundColor: "#0056b3",
    },
    outlineButton: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#007bff",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
    },
    outlineButtonPressed: {
        borderColor: "#0056b3",
    },
    primaryText: {
        color: "#fff",
        fontWeight: "bold",
    },
    outlineText: {
        color: "#007bff",
        fontWeight: "bold",
    },
    // Solid variant styles
    solidButton: {
        backgroundColor: "#28a745",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
    },
    solidButtonPressed: {
        backgroundColor: "#1e7e34",
    },
    solidText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default AnimatedButton;