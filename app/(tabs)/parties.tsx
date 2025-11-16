import axios from "axios";
import {
  Building,
  ExternalLink,
  FileText,
  Search,
  Shield,
  Users as UsersIcon,
  Vote,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 👉 Si ya tienes una instancia de axios (api.ts), usa esa en lugar de esto.
const api = axios.create({
  baseURL: "https://elecciones-backend-59y8.onrender.com/api",
});

// ==== Tipos según tu backend ====

type CandidateRole =
  | "PRESIDENT"
  | "VICE_PRESIDENT"
  | "CONGRESS"
  | "SENATOR"
  | "PARLAMENTO_ANDINO";

type ProposalTopic = "ECONOMY" | "EDUCATION" | "HEALTH" | "SECURITY" | "OTHER";

interface Candidate {
  id: number;
  fullName: string;
  role: CandidateRole;
  regionLevel: "NATIONAL" | "REGIONAL";
  bio: string;
  cvUrl?: string | null;
  partyId: number;
}

interface Proposal {
  id: number;
  title: string;
  description: string;
  topic: ProposalTopic;
  partyId: number;
}

interface Party {
  id: number;
  name: string;
  description: string;
  logoUrl?: string | null;
  website?: string | null;

  // Solo estarán presentes cuando llamamos /parties/:id
  candidates?: Candidate[];
  proposals?: Proposal[];
}

// Map para traducir enum a texto amigable
const ROLE_LABELS: Record<CandidateRole, string> = {
  PRESIDENT: "Candidato(a) a la Presidencia",
  VICE_PRESIDENT: "Candidato(a) a la Vicepresidencia",
  CONGRESS: "Candidato(a) al Congreso",
  SENATOR: "Candidato(a) al Senado",
  PARLAMENTO_ANDINO: "Candidato(a) al Parlamento Andino",
};

const TOPIC_LABELS: Record<ProposalTopic, string> = {
  ECONOMY: "Economía y empleo",
  EDUCATION: "Educación",
  HEALTH: "Salud",
  SECURITY: "Seguridad ciudadana",
  OTHER: "Otros temas",
};

// ================== Componente principal ==================

export default function PartiesScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;

  const [searchQuery, setSearchQuery] = useState("");
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedPartyId, setExpandedPartyId] = useState<number | null>(null);
  const [partyDetails, setPartyDetails] = useState<Record<number, Party>>({});
  const [loadingPartyId, setLoadingPartyId] = useState<number | null>(null);

  useEffect(() => {
    loadParties();
  }, []);

  const loadParties = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<Party[]>("/parties");
      setParties(res.data);
    } catch (e) {
      console.error(e);
      setError("No se pudo cargar la información de los partidos.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWebsite = (url?: string | null) => {
    if (!url) return;
    Linking.openURL(url).catch((err) =>
      console.error("Error al abrir la web:", err)
    );
  };

  const handleToggleParty = async (partyId: number) => {
    if (expandedPartyId === partyId) {
      setExpandedPartyId(null);
      return;
    }

    setExpandedPartyId(partyId);

    // Si ya tenemos detalle, no volvemos a llamar
    if (partyDetails[partyId]) return;

    try {
      setLoadingPartyId(partyId);
      const res = await api.get<Party>(`/parties/${partyId}`);
      setPartyDetails((prev) => ({ ...prev, [partyId]: res.data }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPartyId(null);
    }
  };

  const filteredParties = useMemo(() => {
    if (!searchQuery.trim()) return parties;
    const q = searchQuery.toLowerCase();
    return parties.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
    );
  }, [searchQuery, parties]);

  const renderPartyCard = (party: Party) => {
    const isExpanded = expandedPartyId === party.id;
    const detail = partyDetails[party.id];

    // separo candidatos principales
    const president = detail?.candidates?.find((c) => c.role === "PRESIDENT");
    const vice = detail?.candidates?.find((c) => c.role === "VICE_PRESIDENT");
    const otherCandidates =
      detail?.candidates?.filter(
        (c) => c.role !== "PRESIDENT" && c.role !== "VICE_PRESIDENT"
      ) ?? [];

    // agrupo propuestas por tema
    const proposalsByTopic = (detail?.proposals ?? []).reduce<
      Record<ProposalTopic, Proposal[]>
    >((acc, p) => {
      if (!acc[p.topic]) acc[p.topic] = [];
      acc[p.topic].push(p);
      return acc;
    }, {} as any);

    return (
      <View
        key={party.id}
        style={[styles.partidoCard, isTablet && styles.partidoCardTablet]}
      >
        {/* Header partido */}
        <TouchableOpacity
          onPress={() => handleToggleParty(party.id)}
          activeOpacity={0.9}
        >
          <View style={styles.partidoHeader}>
          <View style={[styles.partidoLogo, { backgroundColor: "#8B1538" }]}>
  {party.logoUrl ? (
    <Image
      source={{ uri: party.logoUrl }}
      style={styles.partidoLogoImage}
      resizeMode="contain"
    />
  ) : (
    <Text style={styles.partidoAcronimo}>
      {party.name.substring(0, 3).toUpperCase()}
    </Text>
  )}
</View>
            <View style={styles.partidoInfo}>
              <Text style={styles.partidoNombre}>{party.name}</Text>
              <Text style={styles.partidoFundacion} numberOfLines={2}>
                {party.description}
              </Text>
              {party.website && (
                <TouchableOpacity
                  style={styles.webChip}
                  onPress={() => handleOpenWebsite(party.website)}
                >
                  <ExternalLink size={14} color="#8B1538" />
                  <Text style={styles.webChipText}>Sitio oficial</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Estado de carga de detalle */}
        {loadingPartyId === party.id && (
          <View style={styles.loadingDetail}>
            <ActivityIndicator size="small" color="#8B1538" />
            <Text style={styles.loadingDetailText}>
              Cargando información del partido...
            </Text>
          </View>
        )}

        {/* Detalle expandido */}
        {isExpanded && detail && (
          <View style={styles.detailContainer}>
            {/* Planchas presidenciales */}
            <View style={styles.detailSection}>
              <View style={styles.detailSectionHeader}>
                <UsersIcon size={18} color="#8B1538" />
                <Text style={styles.detailSectionTitle}>
                  Planchas Presidenciales
                </Text>
              </View>
              {president || vice ? (
                <View style={styles.formulaContainer}>
                  {president && (
                    <View style={styles.personItem}>
                      <Text style={styles.personName}>
                        {president.fullName}
                      </Text>
                      <Text style={styles.personRole}>
                        {ROLE_LABELS[president.role]}
                      </Text>
                    </View>
                  )}
                  {vice && (
                    <View style={styles.personItem}>
                      <Text style={styles.personName}>{vice.fullName}</Text>
                      <Text style={styles.personRole}>
                        {ROLE_LABELS[vice.role]}
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <Text style={styles.emptyText}>
                  Aún no se registran candidaturas presidenciales para este
                  partido.
                </Text>
              )}
            </View>

            {/* Otros candidatos */}
            {otherCandidates.length > 0 && (
              <View style={styles.detailSection}>
                <View style={styles.detailSectionHeader}>
                  <UsersIcon size={18} color="#8B1538" />
                  <Text style={styles.detailSectionTitle}>
                    Otros candidatos
                  </Text>
                </View>
                {otherCandidates.slice(0, 4).map((c) => (
                  <View key={c.id} style={styles.personRow}>
                    <View style={styles.personDot} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.personName}>{c.fullName}</Text>
                      <Text style={styles.personMeta}>
                        {ROLE_LABELS[c.role]} ·{" "}
                        {c.regionLevel === "NATIONAL"
                          ? "Ámbito nacional"
                          : "Ámbito regional"}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Propuestas por tema */}
            <View style={styles.detailSection}>
              <View style={styles.detailSectionHeader}>
                <FileText size={18} color="#8B1538" />
                <Text style={styles.detailSectionTitle}>
                  Propuestas principales
                </Text>
              </View>

              {Object.keys(proposalsByTopic).length === 0 && (
                <Text style={styles.emptyText}>
                  Este partido aún no tiene propuestas registradas en la
                  plataforma.
                </Text>
              )}

              {Object.entries(proposalsByTopic).map(([topic, list]) => (
                <View key={topic} style={styles.topicBlock}>
                  <Text style={styles.topicTitle}>
                    {TOPIC_LABELS[topic as ProposalTopic]}
                  </Text>
                  {list.slice(0, 3).map((p) => (
                    <View key={p.id} style={styles.propuestaItem}>
                      <View style={styles.propuestaBullet} />
                      <Text style={styles.propuestaText}>
                        <Text style={{ fontWeight: "600" }}>{p.title}: </Text>
                        {p.description}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  // ================== RENDER ==================

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#8B1538" />
          <Text style={{ marginTop: 8, color: "#64748B" }}>
            Cargando partidos políticos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Principal */}
      <View style={styles.mainHeader}>
        <View
          style={[
            styles.headerContent,
            isDesktop && styles.headerContentDesktop,
          ]}
        >
          <View style={styles.logoContainer}>
            <Shield size={isDesktop ? 40 : 32} color="#8B1538" />
            <View style={styles.headerText}>
              <Text
                style={[styles.mainTitle, isDesktop && styles.mainTitleDesktop]}
              >
                Agrupaciones Políticas 2026
              </Text>
              <Text
                style={[
                  styles.mainSubtitle,
                  isDesktop && styles.mainSubtitleDesktop,
                ]}
              >
                Consulta los partidos, sus candidatos y propuestas
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Barra de búsqueda */}
      <View
        style={[styles.searchSection, isDesktop && styles.searchSectionDesktop]}
      >
        <View
          style={[
            styles.searchContainer,
            isDesktop && styles.searchContainerDesktop,
          ]}
        >
          <Search size={20} color="#6B7280" />
          <TextInput
            style={[styles.searchInput, isDesktop && styles.searchInputDesktop]}
            placeholder="Buscar por nombre de partido o descripción..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Contenido */}
      <ScrollView
        style={styles.contentScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Card informativa */}
        <View style={[styles.infoCard, isDesktop && styles.infoCardDesktop]}>
          <View style={styles.infoIcon}>
            <Vote size={24} color="#8B1538" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Voto informado</Text>
            <Text style={styles.infoText}>
              Revisa la información de cada agrupación política: planchas
              presidenciales, candidatos y principales propuestas organizadas
              por temas.
            </Text>
          </View>
        </View>

        <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Building size={24} color="#8B1538" />
              <Text style={styles.sectionTitle}>
                {filteredParties.length} partidos encontrados
              </Text>
            </View>
            {error && (
              <Text style={{ color: "#DC2626", marginTop: 4 }}>{error}</Text>
            )}
            <Text style={styles.sectionSubtitle}>
              Toca un partido para ver su detalle, candidatos y propuestas.
            </Text>
          </View>

          <View style={[styles.grid, isTablet && styles.gridTablet]}>
            {filteredParties.map(renderPartyCard)}
            {filteredParties.length === 0 && (
              <Text style={styles.emptyText}>
                No se encontraron partidos que coincidan con tu búsqueda.
              </Text>
            )}
          </View>
        </View>

        {/* Nota oficial */}
        <View
          style={[styles.officialNote, isDesktop && styles.officialNoteDesktop]}
        >
          <Shield size={20} color="#8B1538" />
          <View style={styles.officialContent}>
            <Text style={styles.officialTitle}>Información de referencia</Text>
            <Text style={styles.officialText}>
              La información mostrada resume datos de agrupaciones políticas y
              sus propuestas para las Elecciones Generales 2026. Consulta
              siempre los portales oficiales del JNE y la ONPE para información
              actualizada.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  webChip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#FEF2F2",
    marginTop: 6,
  },
  webChipText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#8B1538",
    fontWeight: "600",
  },
  loadingDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  loadingDetailText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#6B7280",
  },
  detailContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailSectionTitle: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  formulaContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  personItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 6,
    marginBottom: 6,
  },
  personName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  personRole: {
    fontSize: 12,
    color: "#6B7280",
  },
  personRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  personDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#8B1538",
    marginTop: 6,
    marginRight: 8,
  },
  personMeta: {
    fontSize: 12,
    color: "#6B7280",
  },
  topicBlock: {
    marginTop: 4,
    marginBottom: 8,
  },
  topicTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#8B1538",
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    fontStyle: "italic",
    marginTop: 4,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    margin: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  infoCardDesktop: {
    maxWidth: 1200,
    alignSelf: "center",
    width: "90%",
  },
  infoIcon: {
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  section: {
    padding: 20,
  },
  sectionDesktop: {
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E293B",
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#64748B",
    lineHeight: 22,
  },
  partidoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  partidoCardTablet: {
    width: "48%",
  },
  partidoHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  partidoLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  partidoAcronimo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  partidoInfo: {
    flex: 1,
    justifyContent: "center",
  },
  partidoNombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  partidoFundacion: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 8,
  },
  propuestasSection: {
    marginBottom: 16,
  },
  propuestasTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 12,
  },
  propuestaItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  propuestaBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#8B1538",
    marginTop: 6,
    marginRight: 10,
  },
  propuestaText: {
    flex: 1,
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  mainHeader: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerContentDesktop: {
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    marginLeft: 12,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
  },
  mainTitleDesktop: {
    fontSize: 28,
  },
  mainSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
  mainSubtitleDesktop: {
    fontSize: 16,
  },
  desktopNav: {
    flexDirection: "row",
    alignItems: "center",
  },
  desktopNavItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 8,
  },
  searchSection: {
    padding: 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  searchSectionDesktop: {
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainerDesktop: {
    maxWidth: 600,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1E293B",
  },
  searchInputDesktop: {
    fontSize: 18,
  },
  grid: {
    // Grid layout for mobile (single column)
  },
  gridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  contentScroll: {
    flex: 1,
  },
  officialNote: {
    flexDirection: "row",
    backgroundColor: "#F0F9FF",
    margin: 20,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  officialNoteDesktop: {
    maxWidth: 1200,
    alignSelf: "center",
    width: "90%",
  },
  officialContent: {
    flex: 1,
    marginLeft: 12,
  },
  officialTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  officialText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  partidoLogoImage: {
    width: "80%",
    height: "80%",
  },
});

/* const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContentDesktop: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  mainTitleDesktop: {
    fontSize: 28,
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  mainSubtitleDesktop: {
    fontSize: 16,
  },
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  desktopNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 8,
  },
  desktopNavItemActive: {
    backgroundColor: '#8B1538',
  },
  desktopNavLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 8,
  },
  desktopNavLabelActive: {
    color: '#FFFFFF',
  },
  navScroll: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  navContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  navItemActive: {
    backgroundColor: '#8B1538',
    borderColor: '#8B1538',
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 6,
  },
  navLabelActive: {
    color: '#FFFFFF',
  },
  searchSection: {
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  searchSectionDesktop: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainerDesktop: {
    maxWidth: 600,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  searchInputDesktop: {
    fontSize: 18,
  },
  contentScroll: {
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  infoCardDesktop: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '90%',
  },
  infoIcon: {
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  section: {
    padding: 20,
  },
  sectionDesktop: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 22,
  },
  grid: {
    // Grid layout for mobile (single column)
  },
  gridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  partidoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  partidoCardTablet: {
    width: '48%',
  },
  partidoHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  partidoLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  partidoAcronimo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  partidoInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  partidoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  partidoFundacion: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  ideologiaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ideologiaChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  ideologiaText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  candidatosInfo: {
    marginBottom: 16,
  },
  candidatoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  candidatoText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  propuestasSection: {
    marginBottom: 16,
  },
  propuestasTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  propuestaItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  propuestaBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B1538',
    marginTop: 6,
    marginRight: 10,
  },
  propuestaText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B1538',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#8B1538',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  planButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  categoriaSection: {
    marginBottom: 32,
  },
  categoriaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  candidatoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  candidatoCardTablet: {
    width: '48%',
  },
  candidatoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  candidatoFoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  candidatoInfo: {
    flex: 1,
  },
  candidatoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  candidatoPartido: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  candidatoProfesion: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 2,
  },
  candidatoEdad: {
    fontSize: 12,
    color: '#64748B',
  },
  candidatoDetalles: {
    marginBottom: 12,
  },
  detallesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  detalleItem: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
    lineHeight: 16,
  },
  hojaVidaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  hojaVidaText: {
    fontSize: 14,
    color: '#8B1538',
    fontWeight: '600',
    marginLeft: 6,
  },
  comingSoonContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  comingSoon: {
    fontSize: 16,
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
  comingSoonSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  sectoresGrid: {
    // Single column for mobile
  },
  sectoresGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectorCardTablet: {
    width: '48%',
  },
  sectorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectorNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
    textAlign: 'center',
  },
  sectorDescripcion: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  sectorDetalle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#8B1538',
    fontWeight: '600',
  },
  sectorDetalleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 20,
    textAlign: 'center',
  },
  propuestasComparadas: {
    // Styles for compared proposals
  },
  partidoPropuestas: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  partidoHeader1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  partidoLogoSmall: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  partidoAcronimoSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  partidoNombreSmall: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
  },
  propuestasList: {
    // Styles for proposals list
  },
  propuestaComparada: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 6,
    lineHeight: 20,
  },
  noticiaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noticiaCardTablet: {
    width: '48%',
  },
  noticiaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noticiaCategoriaContainer: {
    flex: 1,
  },
  noticiaCategoria: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B1538',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  noticiaFecha: {
    fontSize: 12,
    color: '#64748B',
  },
  noticiaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    lineHeight: 22,
  },
  noticiaResumen: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  noticiaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noticiaFuente: {
    fontSize: 12,
    color: '#8B1538',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B1538',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoBoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  timeline: {
    // Styles for timeline
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B1538',
    marginRight: 12,
  },
  timelineText: {
    fontSize: 14,
    color: '#475569',
  },
  officialNote: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    margin: 20,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  officialNoteDesktop: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '90%',
  },
  officialContent: {
    flex: 1,
    marginLeft: 12,
  },
  officialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  officialText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
}); */
