import React, { useState } from "react";
                  import { View, StyleSheet, ScrollView, useWindowDimensions, TextInput, TouchableOpacity, Text, Image, Alert } from "react-native";
                  import { Feather } from "@expo/vector-icons";
                  import PostCreateView from "@/components/postCreateView";
                  import TrendingServices from "@/components/TrendingServices";
                  import PostCard from "@/components/postCard";

                  const initialPosts = [
                    {
                      user: {
                        name: "Jane Smith",
                        role: "Guitar Teacher",
                        time: "2 hours ago",
                        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
                      },
                      content: "Just finished teaching a great guitar lesson on fingerpicking techniques! Here's a short clip of what we covered. Anyone interested in learning this style?",
                      hashtags: ["guitar", "music", "teaching"],
                      serviceTitle: "Guitar Lessons for Beginners",
                      price: "$25/session",
                      likes: 24,
                      comments: 8,
                      saves: 3,
                      liked: false,
                      saved: false,
                      category: "Para ti",
                      commentsList: [
                        {
                          avatar: "https://randomuser.me/api/portraits/men/2.jpg",
                          user: "Ana",
                          time: "1h",
                          text: "¡Qué buena clase!",
                          likes: 2,
                          liked: false,
                        },
                        {
                          avatar: "https://randomuser.me/api/portraits/men/3.jpg",
                          user: "Luis",
                          time: "30m",
                          text: "Me interesa aprender fingerpicking.",
                          likes: 1,
                          liked: false,
                        },
                      ],
                    },
                    {
                      user: {
                        name: "Alex Johnson",
                        role: "Japanese Language Tutor",
                        time: "5 hours ago",
                        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
                      },
                      content: "今日は日本語を勉強しました！I've created a new set of flashcards for JLPT N4 vocabulary. Would anyone be interested in a group study session this weekend?",
                      hashtags: ["japanese", "language", "jlpt"],
                      serviceTitle: "Japanese Conversation Practice",
                      price: "$20/session",
                      likes: 18,
                      comments: 12,
                      saves: 5,
                      liked: false,
                      saved: false,
                      category: "Seguidores",
                      commentsList: [
                        {
                          avatar: "https://randomuser.me/api/portraits/women/6.jpg",
                          user: "Maria",
                          time: "2h",
                          text: "¡Me apunto al grupo!",
                          likes: 0,
                          liked: false,
                        },
                      ],
                    },
                    {
                      user: {
                        name: "Mark Wilson",
                        role: "Web Developer",
                        time: "Yesterday",
                        avatar: "https://randomuser.me/api/portraits/men/7.jpg",
                      },
                      content: "Just launched my new React course! Looking for beta testers who want to learn modern web development. First 10 people to comment get free access!",
                      hashtags: ["programming", "react", "webdev"],
                      serviceTitle: "Modern Web Development with React",
                      price: "$35/session",
                      likes: 56,
                      comments: 32,
                      saves: 14,
                      liked: false,
                      saved: false,
                      category: "Guardados",
                      commentsList: [],
                    },
                  ];

                  export default function Posts() {
                    const { width, height } = useWindowDimensions();
                    const isMobile = width < 800;

                    const [searchTerm, setSearchTerm] = useState("");
                    const [activeCategory, setActiveCategory] = useState("Para ti");
                    const [posts, setPosts] = useState(initialPosts);
                    const [expandedComments, setExpandedComments] = useState<number | null>(null);
                    const [newComment, setNewComment] = useState("");
                    const [showTrending, setShowTrending] = useState(false);

                    const filteredPosts = posts.filter(
                        (post) =>
                            (
                                activeCategory === "Para ti" ||
                                (activeCategory === "Seguidores" && post.category === "Seguidores") ||
                                (activeCategory === "Guardados" && post.saved) ||
                                (activeCategory === "Recomendado" && post.category === "Para ti")
                            ) &&
                            (
                                searchTerm.trim() === "" ||
                                post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                post.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                post.hashtags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                            )
                    );

                    const handleLike = (idx: number) => {
                      setPosts((prev) =>
                        prev.map((p, i) =>
                          i === idx
                            ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
                            : p
                        )
                      );
                    };

                    const handleSave = (idx: number) => {
                      setPosts((prev) =>
                        prev.map((p, i) =>
                          i === idx
                            ? { ...p, saved: !p.saved, saves: p.saved ? p.saves - 1 : p.saves + 1 }
                            : p
                        )
                      );
                    };

                    const handleComment = (idx: number) => {
                      setExpandedComments(expandedComments === idx ? null : idx);
                      setNewComment("");
                    };

                    const handleLikeComment = (postIdx: number, commentIdx: number) => {
                      setPosts((prev) =>
                        prev.map((p, i) =>
                          i === postIdx
                            ? {
                                ...p,
                                commentsList: p.commentsList.map((c, j) =>
                                  j === commentIdx
                                    ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
                                    : c
                                ),
                              }
                            : p
                        )
                      );
                    };

                    const handleRepostComment = (postIdx: number, commentIdx: number) => {
                      Alert.alert("Repost", "Has reposteado este comentario.");
                    };

                    const handleAddComment = (idx: number) => {
                      if (!newComment.trim()) return;
                      setPosts((prev) =>
                        prev.map((p, i) =>
                          i === idx
                            ? {
                                ...p,
                                commentsList: [
                                  ...(p.commentsList || []),
                                  {
                                    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
                                    user: "Tú",
                                    time: "ahora",
                                    text: newComment,
                                    likes: 0,
                                    liked: false,
                                  },
                                ],
                                comments: p.comments + 1,
                              }
                            : p
                        )
                      );
                      setNewComment("");
                    };

                    return (
                      <View
                        style={[
                          styles.container,
                          isMobile && styles.containerMobile,
                          !isMobile && { height: height },
                        ]}
                      >
                        <View style={[styles.centerColumn, isMobile && styles.columnMobile]}>
                          <ScrollView
                              style={{ flex: 1 }}
                              contentContainerStyle={{ paddingBottom: 32 }}
                              showsVerticalScrollIndicator={false}
                          >
                            {/* Botón y servicios destacados arriba */}
                            {isMobile && (
                                <>
                                  {!showTrending ? (
                                      <TouchableOpacity
                                          style={styles.showTrendingBtn}
                                          onPress={() => setShowTrending(true)}
                                      >
                                        <Text style={styles.showTrendingBtnText}>Ver servicios destacados</Text>
                                      </TouchableOpacity>
                                  ) : (
                                      <View style={{ marginTop: 8, marginBottom: 16 }}>
                                        <TrendingServices />
                                        <TouchableOpacity
                                            style={[styles.showTrendingBtn, { backgroundColor: "#64748b", marginTop: 8 }]}
                                            onPress={() => setShowTrending(false)}
                                        >
                                          <Text style={styles.showTrendingBtnText}>Cerrar destacados</Text>
                                        </TouchableOpacity>
                                      </View>
                                  )}
                                </>
                            )}
                            <PostCreateView
                              searchTerm={searchTerm}
                              setSearchTerm={setSearchTerm}
                              activeCategory={activeCategory}
                              setActiveCategory={setActiveCategory}
                            />
                            {filteredPosts.map((post, idx) => (
                              <View key={idx}>
                                <PostCard
                                  {...post}
                                  onLike={() => handleLike(posts.indexOf(post))}
                                  onSave={() => handleSave(posts.indexOf(post))}
                                  onComment={() => handleComment(idx)}
                                />
                                {expandedComments === idx && (
                                  <View style={styles.commentsSection}>
                                    <Text style={styles.commentsTitle}>Comentarios</Text>
                                    <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false}>
                                      {(post.commentsList || []).map((c, i) => (
                                        <View key={i} style={styles.commentMiniPost}>
                                          <View style={styles.commentRow}>
                                            <Image source={{ uri: c.avatar }} style={styles.commentAvatar} />
                                            <View style={{ flex: 1 }}>
                                              <View style={styles.commentHeaderRow}>
                                                <Text style={styles.commentUser}>{c.user}</Text>
                                                <Text style={styles.commentTime}>{c.time}</Text>
                                              </View>
                                              <Text style={styles.commentText}>{c.text}</Text>
                                              <View style={styles.commentActionsRow}>
                                                <TouchableOpacity
                                                  onPress={() => handleLikeComment(posts.indexOf(post), i)}
                                                  style={styles.commentActionBtn}
                                                >
                                                  <Feather
                                                    name="thumbs-up"
                                                    size={16}
                                                    color={c.liked ? "#2563eb" : "#64748b"}
                                                  />
                                                  <Text style={styles.commentActionText}>{c.likes}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                  onPress={() => handleRepostComment(posts.indexOf(post), i)}
                                                  style={styles.commentActionBtn}
                                                >
                                                  <Feather name="repeat" size={16} color="#64748b" />
                                                  <Text style={styles.commentActionText}>Repost</Text>
                                                </TouchableOpacity>
                                              </View>
                                            </View>
                                          </View>
                                        </View>
                                      ))}
                                    </ScrollView>
                                    <View style={styles.addCommentRow}>
                                      <TextInput
                                        style={styles.commentInput}
                                        placeholder="Escribe un comentario..."
                                        value={newComment}
                                        onChangeText={setNewComment}
                                      />
                                      <TouchableOpacity
                                        style={styles.commentBtn}
                                        onPress={() => handleAddComment(posts.indexOf(post))}
                                      >
                                        <Text style={styles.commentBtnText}>Comentar</Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                )}
                              </View>
                            ))}
                            {isMobile && !showTrending && (
                              <TouchableOpacity
                                style={styles.showTrendingBtn}
                                onPress={() => setShowTrending(true)}
                              >
                                <Text style={styles.showTrendingBtnText}>Ver servicios destacados</Text>
                              </TouchableOpacity>
                            )}
                            {isMobile && showTrending && (
                              <View style={{ marginTop: 24 }}>
                                <TrendingServices />
                              </View>
                            )}
                          </ScrollView>
                        </View>
                        {!isMobile && (
                          <View style={styles.rightColumn}>
                            <TrendingServices />
                          </View>
                        )}
                      </View>
                    );
                  }

                  const styles = StyleSheet.create({
                    container: {
                      flex: 1,
                      flexDirection: "row",
                      backgroundColor: "#f8fafc",
                      padding: 16,
                      justifyContent: "center",
                      alignItems: "flex-start",
                    },
                    containerMobile: {
                      flexDirection: "column",
                      padding: 8,
                      justifyContent: "flex-start",
                      alignItems: "stretch",
                    },
                    centerColumn: {
                      flex: 1,
                      flexBasis: "50%",
                      maxWidth: "50%",
                      minWidth: 0,
                      marginHorizontal: 12,
                      justifyContent: "center",
                    },
                    rightColumn: {
                      flexBasis: "25%",
                      maxWidth: "25%",
                      minWidth: 0,
                      marginLeft: 12,
                      justifyContent: "flex-start",
                    },
                    columnMobile: {
                      maxWidth: "100%",
                      flexBasis: "100%",
                      marginHorizontal: 0,
                      marginLeft: 0,
                      marginRight: 0,
                      marginBottom: 16,
                    },
                    showTrendingBtn: {
                      marginTop: 24,
                      backgroundColor: "#2563eb",
                      borderRadius: 8,
                      paddingVertical: 16,
                      alignItems: "center",
                      width: "100%",
                    },
                    showTrendingBtnText: {
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 16,
                    },
                    commentsSection: {
                      backgroundColor: "#f3f4f6",
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 18,
                    },
                    commentsTitle: {
                      fontWeight: "bold",
                      fontSize: 15,
                      marginBottom: 6,
                      color: "#22223b",
                    },
                    commentMiniPost: {
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 8,
                      shadowColor: "#000",
                      shadowOpacity: 0.03,
                      shadowRadius: 2,
                      elevation: 1,
                    },
                    commentRow: {
                      flexDirection: "row",
                      alignItems: "flex-start",
                    },
                    commentAvatar: {
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      marginRight: 10,
                      backgroundColor: "#e5e7eb",
                    },
                    commentHeaderRow: {
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 2,
                    },
                    commentUser: {
                      fontWeight: "bold",
                      color: "#2563eb",
                      fontSize: 13,
                    },
                    commentTime: {
                      color: "#6b7280",
                      fontSize: 12,
                      marginLeft: 8,
                    },
                    commentText: {
                      color: "#22223b",
                      fontSize: 14,
                      marginBottom: 4,
                    },
                    commentActionsRow: {
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 2,
                    },
                    commentActionBtn: {
                      flexDirection: "row",
                      alignItems: "center",
                      marginRight: 16,
                    },
                    commentActionText: {
                      marginLeft: 4,
                      color: "#64748b",
                      fontSize: 13,
                    },
                    addCommentRow: {
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 8,
                    },
                    commentInput: {
                      flex: 1,
                      backgroundColor: "#fff",
                      borderRadius: 6,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      marginRight: 8,
                    },
                    commentBtn: {
                      backgroundColor: "#2563eb",
                      borderRadius: 6,
                      paddingVertical: 7,
                      paddingHorizontal: 14,
                    },
                    commentBtnText: {
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 13,
                    },
                  });