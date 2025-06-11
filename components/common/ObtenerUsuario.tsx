import { LogOut } from "lucide-react-native";

import { UserService } from "@/api/userService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";



// Componente que obtiene y muestra los datos del usuario logueado, o pide el nombre si no está logueado.
export const ObtenerUsuario = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                // Suponiendo que UserService.getProfile() devuelve los datos del usuario si está logueado
                //const response = await UserService.getProfile();
                //if (response && response.token) {
                    // Si solo devuelve token, no mostrar datos de usuario
                //    setUser(null);
                //} else if (response && response.name) {
                //    setUser(response);
                //} else {
                //    setUser(null);
                //}
            } catch (err: any) {
                setError("Error al obtener usuario");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await UserService.logout();
            setUser(null);
            router.replace("/login");
        } catch {
            setError("Error al cerrar sesión");
        }
    };

    if (loading) {
        return (
            <View style={{ padding: 16 }}>
                <Text>Cargando usuario...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ padding: 16 }}>
                <Text style={{ color: "red" }}>{error}</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={{ padding: 16 }}>
                <Text>Usuario logeado, ¿podrías darme el nombre del usuario?</Text>
            </View>
        );
    }

    return (
        <View style={{ padding: 16, marginTop: insets.top }}>
            <View style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 2,
            }}>
                {user.profilePicture && (
                    <View style={{ marginBottom: 12 }}>
                        <img
                            src={user.profilePicture}
                            alt="Profile"
                            style={{ width: 64, height: 64, borderRadius: 32 }}
                        />
                    </View>
                )}
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>{user.name}</Text>
                <Text style={{ color: "#666", marginBottom: 8 }}>{user.email}</Text>
                <TouchableOpacity
                    onPress={handleLogout}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#f44",
                        padding: 10,
                        borderRadius: 8,
                        marginTop: 12,
                    }}
                >
                    <LogOut color="#fff" size={18} />
                    <Text style={{ color: "#fff", marginLeft: 8 }}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};