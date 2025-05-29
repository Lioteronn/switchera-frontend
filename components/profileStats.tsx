import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, LayoutChangeEvent, Platform } from "react-native";

const stats = [
  { label: "Clases Completadas", value: 42, color: "#2563eb", bg: "#c7e8fb", detail: "Has completado 42 clases con éxito." },
  { label: "Calificación Promedio", value: 4.8, color: "#22c55e", bg: "#b3ffcd", detail: "Tu calificación promedio es 4.8/5." },
  { label: "Horas Totales", value: 86, color: "#a21caf", bg: "#dcc9f1", detail: "Has enseñado un total de 86 horas." },
  { label: "Alumnos Ayudados", value: 28, color: "#f59e42", bg: "#e6d3bc", detail: "Has ayudado a 28 alumnos diferentes." },
];

const CARD_MARGIN = 6;
const ANIMATION_DURATION = 250;

export default function ProfileStats() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const widths = useRef(stats.map(() => new Animated.Value(0))).current;

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setContainerWidth(width);
    const totalMargin = CARD_MARGIN * 2 * stats.length;
    const cardWidth = (width - totalMargin) / stats.length;
    widths.forEach((w) => w.setValue(cardWidth));
  };

  const handlePress = (idx: number) => {
    const totalMargin = CARD_MARGIN * 2 * stats.length;
    const cardWidth = (containerWidth - totalMargin) / stats.length;
    const expandedWidth = containerWidth - totalMargin;
    if (expandedIndex === idx) {
      Animated.parallel(
        widths.map(w =>
          Animated.timing(w, {
            toValue: cardWidth,
            duration: ANIMATION_DURATION,
            useNativeDriver: false,
            easing: Easing.out(Easing.ease),
          })
        )
      ).start(() => setExpandedIndex(null));
    } else {
      Animated.parallel(
        widths.map((w, i) =>
          Animated.timing(w, {
            toValue: i === idx ? expandedWidth : 0,
            duration: ANIMATION_DURATION,
            useNativeDriver: false,
            easing: Easing.out(Easing.ease),
          })
        )
      ).start(() => setExpandedIndex(idx));
    }
  };

  const totalMargin = CARD_MARGIN * 2 * stats.length;
  const expandedWidth = containerWidth - totalMargin;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Estadísticas de Enseñanza</Text>
      <View style={styles.statsRow} onLayout={handleLayout}>
        {stats.map((stat, idx) => {
          const isExpanded = expandedIndex === idx;
          const isHovered = hoveredIndex === idx;
          // @ts-ignore
          // @ts-ignore
          return (
              <Animated.View
                  key={stat.label}
                  style={[
                      styles.statCard,
                      {
                          backgroundColor: isHovered && !isExpanded && Platform.OS === "web"
                              ? "#e0e7ef"
                              : stat.bg,
                          marginHorizontal: CARD_MARGIN,
                          width: widths[idx],
                          minWidth: 0,
                          maxWidth: expandedWidth,
                          opacity: expandedIndex === null || isExpanded ? 1 : 0,
                          boxShadow:
                              isHovered && Platform.OS === "web"
                                  ? "inset 0 0 0 4px #38bdf8, 0 4px 16px rgba(37,99,235,0.12)"
                                  : undefined,
                          cursor: Platform.OS === "web" ? "pointer" : undefined,
                          transition: "box-shadow 0.2s, background 0.2s"
                      },
                  ]}
                  onMouseEnter={Platform.OS === "web" ? () => setHoveredIndex(idx) : undefined}
                  onMouseLeave={Platform.OS === "web" ? () => setHoveredIndex(null) : undefined}
              >
              <TouchableOpacity
                style={{ flex: 1, justifyContent: "center", alignItems: "center", height: "100%" }}
                activeOpacity={0.8}
                onPress={() => handlePress(idx)}
              >
                {isExpanded ? (
                  <View style={{ alignItems: "center" }}>
                    <Text style={[styles.statValueExpanded, { color: stat.color }]}>
                      {"<" + stat.value + ">"}
                    </Text>
                    <Text style={styles.statLabelExpanded}>
                      {"<" + stat.label + ">"}
                    </Text>
                    <Text style={styles.statDetail}>{stat.detail}</Text>
                  </View>
                ) : (
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#22223b",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginBottom: 20,
    width: "100%",
  },
  statCard: {
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    minWidth: 0,
    elevation: 1,
    overflow: "hidden",
    height: 150, // altura aumentada
    transitionProperty: "background, box-shadow",
    transitionDuration: "0.2s",
  },
  statValue: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 6,
  },
  statValueExpanded: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  statLabelExpanded: {
    fontSize: 20,
    color: "#22223b",
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  statDetail: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
    maxWidth: 340, // más ancho para evitar corte
    lineHeight: 22,
  },
});