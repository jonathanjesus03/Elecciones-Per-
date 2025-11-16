import { apiClient } from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Tipo de respuesta del backend para /voters/:dni
type VoterResponse = {
  dni: string;
  fullName: string | null;
  isMesaMember: boolean;
  tableNumber: string;
  votingLocation: {
    id: number;
    department: string;
    province: string;
    district: string;
    placeName: string;
    address: string;
    lat: number;
    lng: number;
  };
};

export default function OnboardingScreen2() {
  const [dni, setDni] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinueWithDni = async () => {
    const trimmed = dni.trim();

    if (trimmed.length !== 8) {
      Alert.alert("DNI inválido", "Ingresa un DNI de 8 dígitos.");
      return;
    }

    try {
      setLoading(true);

      const response = await apiClient.get<VoterResponse>(`/voters/${trimmed}`);
      const voter = response.data;

      // Derivamos el rol a partir de isMesaMember
      const finalRole = voter.isMesaMember ? "mesa" : "elector";

      // Guardar datos en AsyncStorage
      await AsyncStorage.setItem("@user", JSON.stringify(voter));
      await AsyncStorage.setItem("@role", finalRole);

      console.log("Usuario guardado:", voter);
      console.log("Rol guardado:", finalRole);

      // Navegar directamente a la app principal
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error(error);
    
      if (error?.response?.status === 404) {
        Alert.alert(
          "DNI no encontrado",
          "No fue posible identificar una asignación de mesa con el DNI ingresado. Podrás continuar y acceder a toda la información general del proceso electoral."
        );
    
        await AsyncStorage.setItem("@role", "info");
        await AsyncStorage.removeItem("@user");
    
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Error de conexión",
          "No pudimos completar la consulta en este momento. Por favor, verifica tu conexión e intenta nuevamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinueWithoutDni = async () => {
    // Modo solo informativo (rol info)
    await AsyncStorage.setItem("@role", "info");
    await AsyncStorage.removeItem("@user");
    router.replace("/(tabs)");
  };

  const isButtonDisabled = loading || dni.trim().length !== 8;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con bandera peruana */}
        <View className="headerStripe" style={styles.headerStripe}>
          <View
            style={[styles.stripeSection, { backgroundColor: "#B91C1C" }]}
          />
          <View
            style={[styles.stripeSection, { backgroundColor: "#FFFFFF" }]}
          />
          <View
            style={[styles.stripeSection, { backgroundColor: "#B91C1C" }]}
          />
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.title}>Validemos tu información</Text>
          <Text style={styles.subtitle}>
            Ingresa tu DNI para consultar tu local de votación, tu mesa asignada
            y recibir información personalizada.
          </Text>

          {/* Input de DNI */}
          <View style={{ marginTop: 16, marginBottom: 20 }}>
            <Text style={styles.inputLabel}>DNI</Text>
            <TextInput
              value={dni}
              onChangeText={setDni}
              placeholder="Ingresa tu número de DNI"
              keyboardType="number-pad"
              maxLength={8}
              style={styles.input}
            />
            <Text style={styles.helperText}>
              Este dato nos permite mostrarte la información correspondiente a
              tu mesa y local de votación.
            </Text>
          </View>

          {/* Info adicional */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Si el DNI ingresado cuenta con asignación de mesa y local, te
              mostraremos tus datos completos.{"\n"}
              Si no, podrás acceder igualmente a toda la información general
              sobre el proceso electoral.
            </Text>
          </View>
        </View>

        {/* Botón principal */}
        <TouchableOpacity
          style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
          onPress={handleContinueWithDni}
          disabled={isButtonDisabled}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              isButtonDisabled ? ["#9CA3AF", "#6B7280"] : ["#B91C1C", "#991B1B"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>Continuar con mi DNI</Text>
                <ArrowRight size={22} color="white" style={{ marginLeft: 8 }} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Botón secundario: continuar sin DNI */}
        <TouchableOpacity
          onPress={handleContinueWithoutDni}
          style={{ alignItems: "center", marginBottom: 20 }}
          activeOpacity={0.7}
        >
          <Text style={{ color: "#4B5563", fontSize: 14 }}>
            Continuar sin DNI (modo informativo)
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 20,
  },
  headerStripe: {
    flexDirection: "row",
    width: "100%",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 24,
  },
  stripeSection: {
    flex: 1,
  },
  contentSection: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: "#111827",
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },
  infoBox: {
    backgroundColor: "#F0F9FF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BAE6FD",
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: "#1E40AF",
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#B91C1C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    shadowOpacity: 0.08,
    elevation: 2,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
