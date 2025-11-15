import { ExternalLink, FileText, Search, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Linking, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Partido {
  id: number;
  nombre: string;
  acronimo: string;
  candidato: string;
  color: string;
  propuestas: string[];
  planGobierno: string;
}

const PARTIDOS_DATA: Partido[] = [
  {
    id: 1,
    nombre: 'Partido Nacional del Progreso',
    acronimo: 'PNP',
    candidato: 'María Elena Torres',
    color: '#DC2626',
    propuestas: [
      'Educación gratuita y de calidad para todos',
      'Reforma del sistema de salud pública',
      'Creación de 500,000 empleos formales',
      'Lucha contra la corrupción institucional',
    ],
    planGobierno: 'https://ejemplo.pe/plan-pnp',
  },
  {
    id: 2,
    nombre: 'Alianza Democrática Peruana',
    acronimo: 'ADP',
    candidato: 'Carlos Mendoza Vargas',
    color: '#2563EB',
    propuestas: [
      'Modernización de la infraestructura vial',
      'Impulso a la agricultura sostenible',
      'Digitalización del Estado',
      'Seguridad ciudadana y reforma policial',
    ],
    planGobierno: 'https://ejemplo.pe/plan-adp',
  },
  {
    id: 3,
    nombre: 'Frente Popular Unido',
    acronimo: 'FPU',
    candidato: 'Ana Lucía Paredes',
    color: '#059669',
    propuestas: [
      'Protección del medio ambiente',
      'Inclusión social y reducción de la pobreza',
      'Fortalecimiento de los gobiernos locales',
      'Promoción de la cultura peruana',
    ],
    planGobierno: 'https://ejemplo.pe/plan-fpu',
  },
  {
    id: 4,
    nombre: 'Movimiento Renovación Nacional',
    acronimo: 'MRN',
    candidato: 'Jorge Luis Ramírez',
    color: '#7C3AED',
    propuestas: [
      'Inversión en ciencia y tecnología',
      'Apoyo a las pequeñas empresas',
      'Mejora de la calidad educativa',
      'Transparencia y rendición de cuentas',
    ],
    planGobierno: 'https://ejemplo.pe/plan-mrn',
  },
  {
    id: 5,
    nombre: 'Partido del Pueblo Peruano',
    acronimo: 'PPP',
    candidato: 'Rosa María Gonzáles',
    color: '#EA580C',
    propuestas: [
      'Vivienda digna para todos los peruanos',
      'Acceso universal al agua potable',
      'Desarrollo de energías renovables',
      'Protección de los derechos laborales',
    ],
    planGobierno: 'https://ejemplo.pe/plan-ppp',
  },
  {
    id: 6,
    nombre: 'Coalición por el Cambio',
    acronimo: 'CPC',
    candidato: 'Miguel Ángel Soto',
    color: '#0891B2',
    propuestas: [
      'Reforma del sistema judicial',
      'Descentralización efectiva',
      'Fomento del turismo nacional',
      'Conectividad digital en zonas rurales',
    ],
    planGobierno: 'https://ejemplo.pe/plan-cpc',
  },
];

export default function PartiesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPartidos = PARTIDOS_DATA.filter(
    (partido) =>
      partido.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partido.acronimo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partido.candidato.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openURL = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Error opening URL:', err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Partidos Políticos</Text>
          <Text style={styles.headerSubtitle}>
            Conoce las propuestas y planes de gobierno de cada partido
          </Text>
        </View>

        {/* Barra de búsqueda */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar partido, candidato..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Información importante */}
        <View style={styles.infoCard}>
          <FileText size={24} color="#8B1538" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Voto Informado</Text>
            <Text style={styles.infoText}>
              Te recomendamos revisar los planes de gobierno completos antes de decidir tu voto. 
              Un voto informado fortalece nuestra democracia.
            </Text>
          </View>
        </View>

        {/* Lista de partidos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {filteredPartidos.length} {filteredPartidos.length === 1 ? 'Partido' : 'Partidos'}
            </Text>
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearButton}>Limpiar</Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredPartidos.length === 0 ? (
            <View style={styles.emptyState}>
              <Search size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No se encontraron resultados</Text>
              <Text style={styles.emptyDescription}>
                Intenta buscar con otro término
              </Text>
            </View>
          ) : (
            filteredPartidos.map((partido) => (
              <View key={partido.id} style={styles.partidoCard}>
                {/* Header del partido */}
                <View style={styles.partidoHeader}>
                  <View style={[styles.partidoLogo, { backgroundColor: partido.color }]}>
                    <Text style={styles.partidoAcronimo}>{partido.acronimo}</Text>
                  </View>
                  <View style={styles.partidoInfo}>
                    <Text style={styles.partidoNombre}>{partido.nombre}</Text>
                    <View style={styles.candidatoContainer}>
                      <Users size={14} color="#6B7280" />
                      <Text style={styles.candidatoText}>{partido.candidato}</Text>
                    </View>
                  </View>
                </View>

                {/* Propuestas principales */}
                <View style={styles.propuestasSection}>
                  <Text style={styles.propuestasTitle}>Propuestas principales:</Text>
                  {partido.propuestas.map((propuesta, index) => (
                    <View key={index} style={styles.propuestaItem}>
                      <View style={styles.propuestaBullet} />
                      <Text style={styles.propuestaText}>{propuesta}</Text>
                    </View>
                  ))}
                </View>

                {/* Botón de plan de gobierno */}
                <TouchableOpacity
                  style={styles.planButton}
                  onPress={() => openURL(partido.planGobierno)}
                >
                  <FileText size={18} color="#FFFFFF" />
                  <Text style={styles.planButtonText}>Ver plan de gobierno completo</Text>
                  <ExternalLink size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Nota informativa */}
        <View style={styles.noteSection}>
          <Text style={styles.noteTitle}>📋 Nota importante</Text>
          <Text style={styles.noteText}>
            Los planes de gobierno son documentos oficiales presentados por cada partido político 
            ante el Jurado Nacional de Elecciones (JNE). Puedes consultarlos en la página web oficial 
            del JNE para obtener información más detallada.
          </Text>
        </View>

        {/* Espaciado inferior */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 20,
  },
  searchSection: {
    padding: 20,
    paddingBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    ...Platform.select({
      ios: {
        shadowColor: '#8B1538',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  section: {
    padding: 20,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  clearButton: {
    fontSize: 14,
    color: '#8B1538',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  partidoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  partidoHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  partidoLogo: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  partidoAcronimo: {
    fontSize: 20,
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
    color: '#111827',
    marginBottom: 6,
    lineHeight: 24,
  },
  candidatoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  candidatoText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  propuestasSection: {
    marginBottom: 16,
  },
  propuestasTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  propuestaItem: {
    flexDirection: 'row',
    marginBottom: 10,
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
    color: '#4B5563',
    lineHeight: 20,
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B1538',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
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
  noteSection: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});
