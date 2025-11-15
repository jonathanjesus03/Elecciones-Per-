import { AlertCircle, Calendar, CheckCircle2, Clock } from 'lucide-react-native';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

// Datos de ejemplo del calendario electoral
const eventos = [
  {
    id: 1,
    fecha: '15 Enero 2026',
    titulo: 'Inicio del Proceso Electoral',
    descripcion: 'Convocatoria oficial a elecciones generales',
    estado: 'completado',
  },
  {
    id: 2,
    fecha: '20 Febrero 2026',
    titulo: 'Inscripción de Candidatos',
    descripcion: 'Cierre de inscripción de listas electorales',
    estado: 'completado',
  },
  {
    id: 3,
    fecha: '10 Marzo 2026',
    titulo: 'Inicio de Campaña Electoral',
    descripcion: 'Arranque oficial de campañas políticas',
    estado: 'proximo',
  },
  {
    id: 4,
    fecha: '8 Abril 2026',
    titulo: 'Cierre de Campaña',
    descripcion: 'Fin de propaganda electoral',
    estado: 'pendiente',
  },
  {
    id: 5,
    fecha: '11 Abril 2026',
    titulo: 'Día de Elecciones',
    descripcion: 'Votación para Presidente y Congresistas',
    estado: 'importante',
  },
  {
    id: 6,
    fecha: '13 Abril 2026',
    titulo: 'Resultados Oficiales',
    descripcion: 'Proclamación de resultados por ONPE',
    estado: 'pendiente',
  },
];

export default function CalendarScreen() {
  const getEventIcon = (estado: string) => {
    switch (estado) {
      case 'completado':
        return <CheckCircle2 size={20} color="#059669" />;
      case 'proximo':
        return <AlertCircle size={20} color="#D97706" />;
      case 'importante':
        return <Calendar size={20} color="#8B1538" />;
      default:
        return <Clock size={20} color="#6B7280" />;
    }
  };

  const getEventStyle = (estado: string) => {
    switch (estado) {
      case 'completado':
        return { borderColor: '#D1FAE5', backgroundColor: '#F0FDF4' };
      case 'proximo':
        return { borderColor: '#FED7AA', backgroundColor: '#FFFBEB' };
      case 'importante':
        return { borderColor: '#FECACA', backgroundColor: '#FEF2F2' };
      default:
        return { borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconHeader}>
            <Calendar size={28} color="#8B1538" />
          </View>
          <Text style={styles.headerTitle}>Calendario Electoral</Text>
          <Text style={styles.headerSubtitle}>Elecciones Generales 2026</Text>
        </View>

        {/* Franja peruana */}
        <View style={styles.banderaStripe}>
          <View style={[styles.stripeSection, { backgroundColor: '#8B1538' }]} />
          <View style={[styles.stripeSection, { backgroundColor: '#FFFFFF' }]} />
          <View style={[styles.stripeSection, { backgroundColor: '#8B1538' }]} />
        </View>

        {/* Contador de días */}
        <View style={styles.countdownCard}>
          <Text style={styles.countdownNumber}>X</Text>
          <Text style={styles.countdownText}>días para las elecciones</Text>
        </View>

        {/* Timeline de eventos */}
        <View style={styles.timelineContainer}>
          <Text style={styles.sectionTitle}>Fechas Importantes</Text>
          
          {eventos.map((evento, index) => (
            <View key={evento.id} style={styles.timelineItem}>
              {/* Línea vertical (no mostrar en el último) */}
              {index < eventos.length - 1 && <View style={styles.timelineLine} />}
              
              {/* Punto del timeline */}
              <View style={[styles.timelineDot, getEventStyle(evento.estado)]}>
                {getEventIcon(evento.estado)}
              </View>

              {/* Contenido del evento */}
              <View style={[styles.eventCard, getEventStyle(evento.estado)]}>
                <Text style={styles.eventDate}>{evento.fecha}</Text>
                <Text style={styles.eventTitle}>{evento.titulo}</Text>
                <Text style={styles.eventDescription}>{evento.descripcion}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Leyenda */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Leyenda</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <CheckCircle2 size={16} color="#059669" />
              <Text style={styles.legendText}>Completado</Text>
            </View>
            <View style={styles.legendItem}>
              <AlertCircle size={16} color="#D97706" />
              <Text style={styles.legendText}>Próximo</Text>
            </View>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <Calendar size={16} color="#8B1538" />
              <Text style={styles.legendText}>Día Electoral</Text>
            </View>
            <View style={styles.legendItem}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.legendText}>Pendiente</Text>
            </View>
          </View>
        </View>
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
    backgroundColor: '#FFFFFF',
    padding: 24,
    paddingTop: 20,
    alignItems: 'center',
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
  iconHeader: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  banderaStripe: {
    flexDirection: 'row',
    height: 4,
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 2,
    overflow: 'hidden',
  },
  stripeSection: {
    flex: 1,
  },
  countdownCard: {
    backgroundColor: '#8B1538',
    margin: 24,
    marginTop: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#8B1538',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  countdownNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  countdownText: {
    fontSize: 16,
    color: '#FECACA',
    marginTop: 4,
  },
  timelineContainer: {
    padding: 24,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 19,
    top: 40,
    width: 2,
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  timelineDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    zIndex: 1,
  },
  eventCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  eventDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  legendContainer: {
    backgroundColor: '#FFFFFF',
    margin: 24,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 8,
  },
});