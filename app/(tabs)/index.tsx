import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Bell, Calendar, FileText, Globe, GraduationCap, Users, Vote, ChevronRight, MapPin } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { 
  ActivityIndicator, 
  Platform, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  Animated
} from 'react-native';

// Constantes y tipos
const COLORS = {
  primary: '#8B1538',
  primaryDark: '#6A102B',
  primaryLight: '#FEF2F2',
  primaryGradient: ['#8B1538', '#A51B44'],
  secondary: '#1E40AF',
  accent: '#DC2626',
  background: {
    light: '#F8FAFC',
    white: '#FFFFFF',
    card: '#FFFFFF',
    gradient: ['#FFFFFF', '#FEF2F2']
  },
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    light: '#9CA3AF',
    white: '#FFFFFF'
  },
  border: {
    light: '#F1F5F9',
    medium: '#E5E7EB'
  },
  status: {
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626'
  }
} as const;

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32
} as const;

type RolUsuario = 'info' | 'elector' | 'mesa' | 'ambos';

interface UbicacionUsuario {
  departamento: string;
  provincia: string;
  distrito: string;
}

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  isNew?: boolean;
  category?: string;
}

// Componentes reutilizables
const LoadingScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.loadingContainer}>
      <View style={styles.loadingSpinner}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
      <Text style={styles.loadingText}>Cargando información...</Text>
    </View>
  </SafeAreaView>
);

const PeruvianFlagStrip = () => (
  <View style={styles.flagStripe}>
    <View style={[styles.stripeSection, { backgroundColor: COLORS.primary }]} />
    <View style={[styles.stripeSection, { backgroundColor: COLORS.background.white }]} />
    <View style={[styles.stripeSection, { backgroundColor: COLORS.primary }]} />
  </View>
);

const RoleBadge = ({ role }: { role: RolUsuario }) => {
  const isMiembroMesa = role === 'mesa' || role === 'ambos';
  
  if (!isMiembroMesa) return null;
  
  return (
    <View style={styles.badge}>
      <View style={styles.badgeDot} />
      <Text style={styles.badgeText}>Miembro de mesa</Text>
    </View>
  );
};

const UserLocation = ({ location }: { location: UbicacionUsuario | null }) => {
  if (!location) return null;
  
  return (
    <View style={styles.locationContainer}>
      <MapPin size={14} color={COLORS.text.secondary} />
      <Text style={styles.locationText}>
        {location.distrito}, {location.departamento}
      </Text>
    </View>
  );
};

const QuickAccessCard = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  onPress,
  color = COLORS.primary
}: {
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
  onPress: () => void;
  color?: string;
}) => (
  <TouchableOpacity 
    style={styles.quickAccessCard}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.quickAccessIcon, { backgroundColor: `${color}15` }]}>
      <Icon size={28} color={color} />
    </View>
    <View style={styles.quickAccessContent}>
      <Text style={styles.quickAccessTitle}>{title}</Text>
      <Text style={styles.quickAccessSubtitle}>{subtitle}</Text>
    </View>
    <View style={styles.quickAccessArrow}>
      <ChevronRight size={16} color={COLORS.text.light} />
    </View>
  </TouchableOpacity>
);

const NewsCard = ({ title, description, date, isNew = false, category }: NewsItem) => (
  <View style={styles.newsCard}>
    <View style={styles.newsHeader}>
      <View style={styles.newsCategoryContainer}>
        {isNew && (
          <View style={styles.newsBadge}>
            <Text style={styles.newsBadgeText}>Nuevo</Text>
          </View>
        )}
        {category && (
          <Text style={styles.newsCategory}>{category}</Text>
        )}
      </View>
      <Text style={styles.newsDate}>{date}</Text>
    </View>
    <Text style={styles.newsTitle}>{title}</Text>
    <Text style={styles.newsDescription}>{description}</Text>
  </View>
);

const CountdownCard = () => (
  <View style={styles.countdownCard}>
    <View style={styles.countdownHeader}>
      <View style={styles.countdownIcon}>
        <Vote size={24} color={COLORS.primary} />
      </View>
      <View style={styles.countdownTitleContainer}>
        <Text style={styles.countdownTitle}>Elecciones 2026</Text>
        <Text style={styles.countdownSubtitle}>Próximas elecciones generales</Text>
      </View>
    </View>
    
    <View style={styles.countdownContent}>
      <View style={styles.countdownItem}>
        <Text style={styles.countdownNumber}>27</Text>
        <Text style={styles.countdownLabel}>días</Text>
      </View>
      <View style={styles.countdownSeparator}>
        <Text style={styles.countdownSeparatorText}>:</Text>
      </View>
      <View style={styles.countdownItem}>
        <Text style={styles.countdownNumber}>14</Text>
        <Text style={styles.countdownLabel}>horas</Text>
      </View>
      <View style={styles.countdownSeparator}>
        <Text style={styles.countdownSeparatorText}>:</Text>
      </View>
      <View style={styles.countdownItem}>
        <Text style={styles.countdownNumber}>32</Text>
        <Text style={styles.countdownLabel}>min</Text>
      </View>
    </View>
    
    <View style={styles.countdownFooter}>
      <Calendar size={16} color={COLORS.text.secondary} />
      <Text style={styles.countdownDate}>11 de Abril, 2026</Text>
    </View>
  </View>
);

const SectionHeader = ({ title, actionText, onAction }: { 
  title: string; 
  actionText?: string; 
  onAction?: () => void;
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {actionText && (
      <TouchableOpacity onPress={onAction} style={styles.sectionAction}>
        <Text style={styles.sectionActionText}>{actionText}</Text>
        <ChevronRight size={16} color={COLORS.primary} />
      </TouchableOpacity>
    )}
  </View>
);

// Componente principal
export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<RolUsuario | null>(null);
  const [location, setLocation] = useState<UbicacionUsuario | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [storedRole, storedLocation] = await Promise.all([
        AsyncStorage.getItem('@role'),
        AsyncStorage.getItem('@location'),
      ]);

      if (storedRole) {
        setRole(storedRole as RolUsuario);
      }

      if (storedLocation) {
        setLocation(JSON.parse(storedLocation));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = 'Buenos días';
    
    if (hour >= 12 && hour < 18) {
      timeGreeting = 'Buenas tardes';
    } else if (hour >= 18) {
      timeGreeting = 'Buenas noches';
    }

    if (role === 'elector') {
      return `${timeGreeting}, Elector`;
    } else if (role === 'info') {
      return `${timeGreeting}, Ciudadano`;
    } else if (role === 'mesa' || role === 'ambos') {
      return `${timeGreeting}, Miembro de Mesa`;
    }
    
    return `${timeGreeting}, Ciudadano`;
  };

  const newsData: NewsItem[] = [
    {
      id: '1',
      title: 'Cronograma Electoral 2026 - Fechas Clave Confirmadas',
      description: 'El JNE ha publicado el cronograma oficial con todas las fechas importantes del proceso electoral.',
      date: 'Hace 2 horas',
      isNew: true,
      category: 'Actualidad'
    },
    {
      id: '2',
      title: 'Capacitación Virtual para Miembros de Mesa',
      description: 'ONPE anuncia nuevas fechas para la capacitación virtual obligatoria de miembros de mesa.',
      date: 'Hace 5 horas',
      category: 'Capacitación'
    },
    {
      id: '3',
      title: 'Nuevos Protocolos de Bioseguridad para Locales de Votación',
      description: 'Conoce las medidas de seguridad implementadas para garantizar votación segura.',
      date: 'Ayer',
      category: 'Protocolos'
    }
  ];

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header con gradiente */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <UserLocation location={location} />
            </View>
            <RoleBadge role={role!} />
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationDot} />
            <Bell size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Bandera Peruana decorativa */}
        <PeruvianFlagStrip />

        {/* Contador de elecciones */}
        <View style={styles.section}>
          <CountdownCard />
        </View>

        {/* Accesos Rápidos */}
        <View style={styles.section}>
          <SectionHeader 
            title="Accesos Rápidos" 
            actionText="Ver todos"
            onAction={() => router.push('/(tabs)')}
          />
          <View style={styles.quickAccessGrid}>
            <QuickAccessCard
              icon={Vote}
              title="Mi Local"
              subtitle="de Votación"
              onPress={() => router.push('/(tabs)/voting')}
              color={COLORS.primary}
            />
            <QuickAccessCard
              icon={FileText}
              title="Propuestas"
              subtitle="de Partidos"
              onPress={() => router.push('/(tabs)/parties')}
              color={COLORS.secondary}
            />
            <QuickAccessCard
              icon={Users}
              title="Mi Rol"
              subtitle="en Elecciones"
              onPress={() => router.push('/(tabs)/myrole')}
              color={COLORS.status.warning}
            />
            <QuickAccessCard
              icon={Calendar}
              title="Calendario"
              subtitle="Electoral"
              onPress={() => router.push('/(tabs)/calendar')}
              color={COLORS.status.success}
            />
          </View>
        </View>

        {/* Más herramientas */}
        <View style={styles.section}>
          <SectionHeader title="Más Herramientas" />
          <View style={styles.toolsGrid}>
            <TouchableOpacity style={styles.toolCard}>
              <View style={[styles.toolIcon, { backgroundColor: `${COLORS.primary}15` }]}>
                <Globe size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.toolText}>Fuentes Oficiales</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolCard}>
              <View style={[styles.toolIcon, { backgroundColor: `${COLORS.secondary}15` }]}>
                <GraduationCap size={22} color={COLORS.secondary} />
              </View>
              <Text style={styles.toolText}>Tutorial App</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolCard}>
              <View style={[styles.toolIcon, { backgroundColor: `${COLORS.status.success}15` }]}>
                <Users size={22} color={COLORS.status.success} />
              </View>
              <Text style={styles.toolText}>Mi Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Noticias Recientes */}
        <View style={styles.section}>
          <SectionHeader 
            title="Últimas Noticias" 
            actionText="Ver todas"
            onAction={() => console.log('Ver todas las noticias')}
          />
          <View style={styles.newsList}>
            {newsData.map(news => (
              <NewsCard key={news.id} {...news} />
            ))}
          </View>
        </View>

        {/* Espacio al final */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.light,
  },
  loadingSpinner: {
    marginBottom: SPACING.md,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    flex: 1,
  },
  userInfo: {
    marginBottom: SPACING.sm,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
    lineHeight: 34,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    zIndex: 1,
  },
  // Location
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  // Bandera
  flagStripe: {
    flexDirection: 'row',
    height: 3,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: 2,
    overflow: 'hidden',
  },
  stripeSection: {
    flex: 1,
  },
  // Secciones generales
  section: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionActionText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: SPACING.xs,
  },
  // Countdown Card
  countdownCard: {
    backgroundColor: COLORS.background.white,
    padding: SPACING.lg,
    borderRadius: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  countdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  countdownIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  countdownTitleContainer: {
    flex: 1,
  },
  countdownTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  countdownSubtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  countdownContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  countdownItem: {
    alignItems: 'center',
  },
  countdownNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    lineHeight: 38,
  },
  countdownLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '600',
    marginTop: 2,
  },
  countdownSeparator: {
    marginHorizontal: SPACING.sm,
  },
  countdownSeparatorText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.light,
    marginBottom: 16,
  },
  countdownFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  countdownDate: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  // Accesos rápidos
  quickAccessGrid: {
    gap: SPACING.md,
  },
  quickAccessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.white,
    padding: SPACING.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  quickAccessIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  quickAccessContent: {
    flex: 1,
  },
  quickAccessTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  quickAccessSubtitle: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
  quickAccessArrow: {
    opacity: 0.6,
  },
  // Tools Grid
  toolsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  toolCard: {
    flex: 1,
    backgroundColor: COLORS.background.white,
    padding: SPACING.md,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border.light,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  toolText: {
    fontSize: 12,
    color: COLORS.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Noticias
  newsList: {
    gap: SPACING.md,
  },
  newsCard: {
    backgroundColor: COLORS.background.white,
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  newsCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  newsBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  newsBadgeText: {
    color: COLORS.text.white,
    fontSize: 10,
    fontWeight: '700',
  },
  newsCategory: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  newsDate: {
    fontSize: 12,
    color: COLORS.text.light,
    fontWeight: '500',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    lineHeight: 22,
  },
  newsDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  // Badge
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 6,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  // Bottom spacer
  bottomSpacer: {
    height: SPACING.xxl,
  },
});