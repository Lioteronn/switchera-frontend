import React from "react";
      import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

      type ProfileSkillInfoProps = {
        onAddTeachingSkill?: () => void;
        onAddLearningSkill?: () => void;
      };

      export default function ProfileSkillInfo({
        onAddTeachingSkill,
        onAddLearningSkill,
      }: ProfileSkillInfoProps) {
        const teachingSkills = [
          { name: "Guitar", level: "Beginner to Intermediate" },
          { name: "Piano", level: "Beginner" },
          { name: "Music Theory", level: "" },
        ];

        const learningSkills = [
          { name: "JavaScript", level: "Intermediate" },
          { name: "React", level: "Beginner" },
        ];

        return (
          <View>
            {/* Teaching Section */}
            <View style={[styles.section, styles.teaching]}>
              <Text style={styles.sectionTitle}>Teaching</Text>
              <Text style={styles.sectionSubtitle}>Skills I Offer</Text>
              {teachingSkills.map((skill, idx) => (
                <View key={idx} style={styles.skillRow}>
                  <Text style={styles.skillName}>
                    {skill.name}
                    {skill.level ? ` - ${skill.level}` : ""}
                  </Text>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addButtonBlue}
                onPress={onAddTeachingSkill}
              >
                <Text style={styles.addButtonText}>Add New Skill</Text>
              </TouchableOpacity>
            </View>

            {/* Learning Section */}
            <View style={[styles.section, styles.learning]}>
              <Text style={styles.sectionTitle}>Learning</Text>
              <Text style={styles.sectionSubtitle}>Skills I Want</Text>
              {learningSkills.map((skill, idx) => (
                <View key={idx} style={styles.skillRow}>
                  <Text style={styles.skillName}>
                    {skill.name}
                    {skill.level ? ` - ${skill.level}` : ""}
                  </Text>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addButtonRed}
                onPress={onAddLearningSkill}
              >
                <Text style={styles.addButtonText}>Add Learning Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }

      const styles = StyleSheet.create({
        section: {
          borderRadius: 16,
          padding: 18,
          marginBottom: 20,
        },
        teaching: {
          backgroundColor: "#e0e7ff",
          borderColor: "#2563eb",
          borderWidth: 1,
        },
        learning: {
          backgroundColor: "#fee2e2",
          borderColor: "#dc2626",
          borderWidth: 1,
        },
        sectionTitle: {
          fontSize: 17,
          fontWeight: "bold",
          marginBottom: 2,
          color: "#22223b",
        },
        sectionSubtitle: {
          fontSize: 14,
          color: "#6b7280",
          marginBottom: 10,
        },
        skillRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 6,
        },
        skillName: {
          fontSize: 15,
          color: "#22223b",
        },
        addButtonBlue: {
          marginTop: 10,
          backgroundColor: "#2563eb",
          borderRadius: 8,
          paddingVertical: 7,
          alignItems: "center",
        },
        addButtonRed: {
          marginTop: 10,
          backgroundColor: "#dc2626",
          borderRadius: 8,
          paddingVertical: 7,
          alignItems: "center",
        },
        addButtonText: {
          color: "#fff",
          fontWeight: "bold",
          fontSize: 14,
        },
      });