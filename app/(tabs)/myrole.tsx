import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    AlertCircle,
    Book,
    CheckCircle,
    Clock,
    ExternalLink,
    FileText,
    Globe,
    Shield,
    Users
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type RolUsuario = 'info' | 'elector' | 'mesa' | 'ambos';

interface UbicacionUsuario {
  departamento: string;
  provincia: string;
  distrito: string;
}

export default function MyRoleScreen() {
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

  const openURL = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B1538" />
          <Text style={styles.loadingText}>Cargando información...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getRoleTitle = () => {
    switch (role) {
      case 'info':
        return 'Ciudadano Informado';
      case 'elector':
        return 'Elector';
      case 'mesa':
        return 'Miembro de Mesa';
      case 'ambos':
        return 'Elector y Miembro de Mesa';
      default:
        return 'Tu Rol';
    }
  };

  const getRoleDescription = () => {
    switch (role) {
      case 'info':
        return 'Estás aquí para informarte sobre el proceso electoral peruano. Conoce cómo funcionan las elecciones y los pasos clave.';
      case 'elector':
        return 'Como elector, tienes el derecho y deber de ejercer tu voto. Aquí encontrarás toda la información para participar activamente.';
      case 'mesa':
        return 'Has sido designado como miembro de mesa. Tu rol es fundamental para garantizar un proceso electoral transparente y justo.';
      case 'ambos':
        return 'Tienes la doble responsabilidad de votar como elector y apoyar el proceso como miembro de mesa. ¡Gracias por tu compromiso!';
      default:
        return 'Conoce tu rol en estas elecciones.';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{getRoleTitle()}</Text>
          <Text style={styles.headerSubtitle}>{getRoleDescription()}</Text>
        </View>

        {/* Rol específico - Info General */}
        {role === 'info' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>¿Cómo funciona el proceso electoral?</Text>

            <View style={styles.processCard}>
              <View style={styles.processStep}>
                <View style={styles.processIcon}>
                  <Users size={24} color="#8B1538" />
                </View>
                <View style={styles.processContent}>
                  <Text style={styles.processTitle}>1. Empadronamiento</Text>
                  <Text style={styles.processDescription}>
                    Todos los ciudadanos peruanos mayores de 18 años son automáticamente empadronados por RENIEC.
                  </Text>
                </View>
              </View>

              <View style={styles.processStep}>
                <View style={styles.processIcon}>
                  <FileText size={24} color="#8B1538" />
                </View>
                <View style={styles.processContent}>
                  <Text style={styles.processTitle}>2. Inscripción de candidatos</Text>
                  <Text style={styles.processDescription}>
                    Los partidos y movimientos inscriben a sus candidatos ante el JNE.
                  </Text>
                </View>
              </View>

              <View style={styles.processStep}>
                <View style={styles.processIcon}>
                  <Book size={24} color="#8B1538" />
                </View>
                <View style={styles.processContent}>
                  <Text style={styles.processTitle}>3. Campaña electoral</Text>
                  <Text style={styles.processDescription}>
                    Periodo en el que candidatos difunden sus propuestas y planes de gobierno.
                  </Text>
                </View>
              </View>

              <View style={styles.processStep}>
                <View style={styles.processIcon}>
                  <CheckCircle size={24} color="#8B1538" />
                </View>
                <View style={styles.processContent}>
                  <Text style={styles.processTitle}>4. Jornada electoral</Text>
                  <Text style={styles.processDescription}>
                    Día de votación donde los ciudadanos ejercen su derecho al voto.
                  </Text>
                </View>
              </View>

              <View style={styles.processStep}>
                <View style={styles.processIcon}>
                  <Shield size={24} color="#8B1538" />
                </View>
                <View style={styles.processContent}>
                  <Text style={styles.processTitle}>5. Conteo y proclamación</Text>
                  <Text style={styles.processDescription}>
                    ONPE realiza el conteo oficial y proclama a los ganadores.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Rol específico - Elector */}
        {(role === 'elector' || role === 'ambos') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tus pasos clave como Elector</Text>

            <View style={styles.keyStepCard}>
              <View style={styles.keyStepNumber}>
                <Text style={styles.keyStepNumberText}>1</Text>
              </View>
              <View style={styles.keyStepContent}>
                <Text style={styles.keyStepTitle}>Verifica tu local de votación</Text>
                <Text style={styles.keyStepDescription}>
                  Consulta en la app dónde te corresponde votar y la ubicación exacta de tu mesa.
                </Text>
              </View>
            </View>

            <View style={styles.keyStepCard}>
              <View style={styles.keyStepNumber}>
                <Text style={styles.keyStepNumberText}>2</Text>
              </View>
              <View style={styles.keyStepContent}>
                <Text style={styles.keyStepTitle}>Investiga a los candidatos</Text>
                <Text style={styles.keyStepDescription}>
                  Revisa las propuestas y planes de gobierno de cada partido político.
                </Text>
              </View>
            </View>

            <View style={styles.keyStepCard}>
              <View style={styles.keyStepNumber}>
                <Text style={styles.keyStepNumberText}>3</Text>
              </View>
              <View style={styles.keyStepContent}>
                <Text style={styles.keyStepTitle}>Prepara tu DNI</Text>
                <Text style={styles.keyStepDescription}>
                  Asegúrate de tener tu documento en buen estado y no vencido.
                </Text>
              </View>
            </View>

            <View style={styles.keyStepCard}>
              <View style={styles.keyStepNumber}>
                <Text style={styles.keyStepNumberText}>4</Text>
              </View>
              <View style={styles.keyStepContent}>
                <Text style={styles.keyStepTitle}>Vota el día de las elecciones</Text>
                <Text style={styles.keyStepDescription}>
                  Acude a tu local electoral entre las 8:00 AM y 4:00 PM.
                </Text>
              </View>
            </View>

            <View style={styles.importantCard}>
              <AlertCircle size={20} color="#8B1538" />
              <Text style={styles.importantText}>
                <Text style={styles.importantBold}>Importante: </Text>
                El voto es obligatorio para ciudadanos entre 18 y 70 años. Votar es un derecho y un deber cívico.
              </Text>
            </View>
          </View>
        )}

        {/* Rol específico - Miembro de Mesa */}
        {(role === 'mesa' || role === 'ambos') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tus responsabilidades como Miembro de Mesa</Text>

            <View style={styles.responsibilityCard}>
              <CheckCircle size={24} color="#22C55E" />
              <View style={styles.responsibilityContent}>
                <Text style={styles.responsibilityTitle}>Instalación de la mesa</Text>
                <Text style={styles.responsibilityDescription}>
                  Debes estar presente desde las 7:00 AM para instalar la mesa electoral y verificar los materiales.
                </Text>
              </View>
            </View>

            <View style={styles.responsibilityCard}>
              <CheckCircle size={24} color="#22C55E" />
              <View style={styles.responsibilityContent}>
                <Text style={styles.responsibilityTitle}>Identificación de electores</Text>
                <Text style={styles.responsibilityDescription}>
                  Verifica la identidad de cada votante con su DNI y el padrón electoral.
                </Text>
              </View>
            </View>

            <View style={styles.responsibilityCard}>
              <CheckCircle size={24} color="#22C55E" />
              <View style={styles.responsibilityContent}>
                <Text style={styles.responsibilityTitle}>Entrega de cédulas</Text>
                <Text style={styles.responsibilityDescription}>
                  Proporciona las cédulas de votación correspondientes a cada elector.
                </Text>
              </View>
            </View>

            <View style={styles.responsibilityCard}>
              <CheckCircle size={24} color="#22C55E" />
              <View style={styles.responsibilityContent}>
                <Text style={styles.responsibilityTitle}>Conteo de votos</Text>
                <Text style={styles.responsibilityDescription}>
                  Al cierre (4:00 PM), realiza el conteo público de los votos junto a los personeros.
                </Text>
              </View>
            </View>

            <View style={styles.responsibilityCard}>
              <CheckCircle size={24} color="#22C55E" />
              <View style={styles.responsibilityContent}>
                <Text style={styles.responsibilityTitle}>Elaboración de actas</Text>
                <Text style={styles.responsibilityDescription}>
                  Completa y firma las actas electorales con los resultados de tu mesa.
                </Text>
              </View>
            </View>

            <View style={styles.capacitacionCard}>
              <Clock size={24} color="#EAB308" />
              <View style={styles.capacitacionContent}>
                <Text style={styles.capacitacionTitle}>Capacitación obligatoria</Text>
                <Text style={styles.capacitacionDescription}>
                  La ONPE realizará capacitaciones virtuales y presenciales. Es obligatorio asistir para conocer tus funciones.
                </Text>
                <TouchableOpacity style={styles.capacitacionButton}>
                  <Text style={styles.capacitacionButtonText}>Ver fechas de capacitación</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Fuentes oficiales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fuentes Oficiales</Text>

          <TouchableOpacity 
            style={styles.sourceCard}
            onPress={() => openURL('https://www.onpe.gob.pe')}
          >
            <Globe size={24} color="#8B1538" />
            <View style={styles.sourceContent}>
              <Text style={styles.sourceTitle}>ONPE</Text>
              <Text style={styles.sourceDescription}>Oficina Nacional de Procesos Electorales</Text>
            </View>
            <ExternalLink size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sourceCard}
            onPress={() => openURL('https://www.jne.gob.pe')}
          >
            <Globe size={24} color="#8B1538" />
            <View style={styles.sourceContent}>
              <Text style={styles.sourceTitle}>JNE</Text>
              <Text style={styles.sourceDescription}>Jurado Nacional de Elecciones</Text>
            </View>
            <ExternalLink size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sourceCard}
            onPress={() => openURL('https://www.reniec.gob.pe')}
          >
            <Globe size={24} color="#8B1538" />
            <View style={styles.sourceContent}>
              <Text style={styles.sourceTitle}>RENIEC</Text>
              <Text style={styles.sourceDescription}>Registro Nacional de Identificación y Estado Civil</Text>
            </View>
            <ExternalLink size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sourceCard}
            onPress={() => openURL('https://www.gob.pe/onpe')}
          >
            <Globe size={24} color="#8B1538" />
            <View style={styles.sourceContent}>
              <Text style={styles.sourceTitle}>Infogob</Text>
              <Text style={styles.sourceDescription}>Portal de información electoral del Estado Peruano</Text>
            </View>
            <ExternalLink size={20} color="#6B7280" />
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
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
    marginTop: 8,
    lineHeight: 20,
  },
  section: {
    padding: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  processCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
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
  processStep: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  processIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  processContent: {
    flex: 1,
  },
  processTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  processDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  keyStepCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
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
  keyStepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B1538',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  keyStepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  keyStepContent: {
    flex: 1,
  },
  keyStepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  keyStepDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  importantCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 16,
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
  importantText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  importantBold: {
    fontWeight: 'bold',
    color: '#991B1B',
  },
  responsibilityCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
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
  responsibilityContent: {
    flex: 1,
    marginLeft: 12,
  },
  responsibilityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  responsibilityDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  capacitacionCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF9C3',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE047',
    marginTop: 16,
  },
  capacitacionContent: {
    flex: 1,
    marginLeft: 12,
  },
  capacitacionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  capacitacionDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  capacitacionButton: {
    backgroundColor: '#EAB308',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  capacitacionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
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
  sourceContent: {
    flex: 1,
    marginLeft: 12,
  },
  sourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  sourceDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
});
