import { 
  ExternalLink, 
  FileText, 
  Search, 
  Users, 
  MapPin, 
  Globe, 
  Newspaper, 
  UserCheck, 
  Award, 
  BarChart3, 
  Shield,
  Building,
  Vote,
  Scale,
  BookOpen,
  Heart,
  Briefcase,
  GraduationCap,
  Landmark,
  Globe2,
  Microscope,
  TreePine,
  Wifi,
  Car,
  ShieldCheck
} from 'lucide-react-native';
import React, { useState } from 'react';
import { 
  Linking, 
  Platform, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  useWindowDimensions 
} from 'react-native';

interface Partido {
  id: number;
  nombre: string;
  acronimo: string;
  candidato: string;
  vicepresidente: string;
  color: string;
  propuestas: string[];
  planGobierno: string;
  fundacion: number;
  ideologia: string[];
}

interface Candidato {
  id: number;
  nombre: string;
  partido: string;
  cargo: string;
  region?: string;
  experiencia: string[];
  educacion: string[];
  propuestas: string[];
  hojaVida: string;
  edad: number;
  profesion: string;
}

interface Noticia {
  id: number;
  titulo: string;
  resumen: string;
  fecha: string;
  fuente: string;
  url: string;
  categoria: string;
  imagen?: string;
}

const PARTIDOS_DATA: Partido[] = [
  {
    id: 1,
    nombre: 'Partido Nacional del Progreso',
    acronimo: 'PNP',
    candidato: 'María Elena Torres',
    vicepresidente: 'Roberto Silva Méndez',
    color: '#DC2626',
    propuestas: [
      'Educación gratuita y de calidad para todos',
      'Reforma del sistema de salud pública',
      'Creación de 500,000 empleos formales',
      'Lucha contra la corrupción institucional',
    ],
    planGobierno: 'https://ejemplo.pe/plan-pnp',
    fundacion: 1995,
    ideologia: ['Progresismo', 'Socialdemocracia']
  },
  {
    id: 2,
    nombre: 'Alianza Democrática Peruana',
    acronimo: 'ADP',
    candidato: 'Carlos Mendoza Vargas',
    vicepresidente: 'Lucía Fernández Rojas',
    color: '#2563EB',
    propuestas: [
      'Modernización de la infraestructura vial',
      'Impulso a la agricultura sostenible',
      'Digitalización del Estado',
      'Seguridad ciudadana y reforma policial',
    ],
    planGobierno: 'https://ejemplo.pe/plan-adp',
    fundacion: 2005,
    ideologia: ['Liberalismo', 'Conservadurismo']
  },
  {
    id: 3,
    nombre: 'Frente Popular Unido',
    acronimo: 'FPU',
    candidato: 'Ana Lucía Paredes',
    vicepresidente: 'Javier Rojas Quiroga',
    color: '#059669',
    propuestas: [
      'Protección del medio ambiente',
      'Inclusión social y reducción de la pobreza',
      'Fortalecimiento de los gobiernos locales',
      'Promoción de la cultura peruana',
    ],
    planGobierno: 'https://ejemplo.pe/plan-fpu',
    fundacion: 1988,
    ideologia: ['Ecologismo', 'Socialismo democrático']
  },
  {
    id: 4,
    nombre: 'Movimiento Renovación Nacional',
    acronimo: 'MRN',
    candidato: 'Jorge Luis Ramírez',
    vicepresidente: 'Sofia Mendoza Castro',
    color: '#7C3AED',
    propuestas: [
      'Inversión en ciencia y tecnología',
      'Apoyo a las pequeñas empresas',
      'Mejora de la calidad educativa',
      'Transparencia y rendición de cuentas',
    ],
    planGobierno: 'https://ejemplo.pe/plan-mrn',
    fundacion: 2010,
    ideologia: ['Tecnocrático', 'Progresista']
  },
  {
    id: 5,
    nombre: 'Partido del Pueblo Peruano',
    acronimo: 'PPP',
    candidato: 'Rosa María Gonzáles',
    vicepresidente: 'Miguel Torres Herrera',
    color: '#EA580C',
    propuestas: [
      'Vivienda digna para todos los peruanos',
      'Acceso universal al agua potable',
      'Desarrollo de energías renovables',
      'Protección de los derechos laborales',
    ],
    planGobierno: 'https://ejemplo.pe/plan-ppp',
    fundacion: 1975,
    ideologia: ['Populismo', 'Nacionalismo']
  },
  {
    id: 6,
    nombre: 'Coalición por el Cambio',
    acronimo: 'CPC',
    candidato: 'Miguel Ángel Soto',
    vicepresidente: 'Carmen Rosa Velasco',
    color: '#0891B2',
    propuestas: [
      'Reforma del sistema judicial',
      'Descentralización efectiva',
      'Fomento del turismo nacional',
      'Conectividad digital en zonas rurales',
    ],
    planGobierno: 'https://ejemplo.pe/plan-cpc',
    fundacion: 2015,
    ideologia: ['Liberal', 'Reformista']
  },
  {
    id: 7,
    nombre: 'Unión Patriótica Peruana',
    acronimo: 'UPP',
    candidato: 'Ricardo Benavides Llosa',
    vicepresidente: 'Patricia Delgado Ruiz',
    color: '#CA8A04',
    propuestas: [
      'Fortalecimiento de las Fuerzas Armadas',
      'Protección de la soberanía nacional',
      'Inversión en defensa nacional',
      'Promoción de valores patrióticos',
    ],
    planGobierno: 'https://ejemplo.pe/plan-upp',
    fundacion: 2000,
    ideologia: ['Patriotismo', 'Conservadurismo']
  },
  {
    id: 8,
    nombre: 'Fuerza Verde Ecológica',
    acronimo: 'FVE',
    candidato: 'Laura Cristina Moscoso',
    vicepresidente: 'Daniel Vega Maldonado',
    color: '#16A34A',
    propuestas: [
      'Transición energética 100% renovable',
      'Protección de áreas naturales',
      'Agricultura orgánica nacional',
      'Impulso al ecoturismo',
    ],
    planGobierno: 'https://ejemplo.pe/plan-fve',
    fundacion: 2012,
    ideologia: ['Ecologismo', 'Sostenibilidad']
  }
];

const CANDIDATOS_DATA: Candidato[] = [
  {
    id: 1,
    nombre: 'María Elena Torres',
    partido: 'PNP',
    cargo: 'Presidencia',
    experiencia: [
      'Ex Ministra de Educación (2018-2020)',
      'Rectora de la Universidad Nacional Mayor de San Marcos',
      '15 años en servicio público',
      'Autora de 5 libros sobre política educativa'
    ],
    educacion: [
      'Doctorado en Ciencias Políticas - Universidad de Harvard',
      'Maestría en Administración Pública - London School of Economics',
      'Bachiller en Derecho - PUCP'
    ],
    propuestas: ['Reforma educativa integral', 'Fortalecimiento de la salud pública'],
    hojaVida: 'https://ejemplo.pe/cv-torres',
    edad: 52,
    profesion: 'Educadora y Politóloga'
  },
  {
    id: 2,
    nombre: 'Carlos Mendoza Vargas',
    partido: 'ADP',
    cargo: 'Presidencia',
    experiencia: [
      'Ex Alcalde de Lima Metropolitana',
      'Empresario del sector construcción',
      '10 años en gestión pública',
      'Presidente de la Cámara de Comercio de Lima'
    ],
    educacion: [
      'Ingeniero Civil - Universidad Nacional de Ingeniería',
      'MBA en Gestión Pública - ESAN',
      'Especialización en Infraestructura - MIT'
    ],
    propuestas: ['Infraestructura nacional', 'Modernización del estado'],
    hojaVida: 'https://ejemplo.pe/cv-mendoza',
    edad: 58,
    profesion: 'Ingeniero Civil'
  },
  {
    id: 3,
    nombre: 'Ana Lucía Paredes',
    partido: 'FPU',
    cargo: 'Presidencia',
    experiencia: [
      'Líder ambiental y defensora de derechos humanos',
      'Ex Congresista de la República',
      'Fundadora de ONG "Tierra Viva"',
      'Consultora internacional en desarrollo sostenible'
    ],
    educacion: [
      'Maestría en Desarrollo Sostenible - Universidad de Cambridge',
      'Sociología - Universidad Nacional Mayor de San Marcos',
      'Especialización en Derechos Humanos - ONU'
    ],
    propuestas: ['Transición ecológica', 'Economía circular'],
    hojaVida: 'https://ejemplo.pe/cv-paredes',
    edad: 45,
    profesion: 'Socióloga Ambiental'
  },
  {
    id: 4,
    nombre: 'Jorge Luis Ramírez',
    partido: 'MRN',
    cargo: 'Presidencia',
    experiencia: [
      'Ex Ministro de Ciencia y Tecnología',
      'CEO de Startup Tecnológica exitosa',
      'Investigador en inteligencia artificial',
      'Asesor de innovación en CAF'
    ],
    educacion: [
      'PhD en Ciencias de la Computación - Stanford University',
      'Maestría en Inteligencia Artificial - MIT',
      'Ingeniería de Sistemas - UTEC'
    ],
    propuestas: ['Revolución digital', 'Gobierno 4.0'],
    hojaVida: 'https://ejemplo.pe/cv-ramirez',
    edad: 39,
    profesion: 'Científico de Datos'
  },
  {
    id: 5,
    nombre: 'Roberto Silva Méndez',
    partido: 'PNP',
    cargo: 'Vicepresidencia',
    experiencia: [
      'Ex Viceministro de Economía',
      'Economista Jefe del BCRP',
      'Profesor Universitario',
      'Consultor del FMI'
    ],
    educacion: [
      'Doctorado en Economía - Universidad de Chicago',
      'Maestría en Economía - London School of Economics',
      'Economía - Universidad del Pacífico'
    ],
    propuestas: ['Estabilidad macroeconómica', 'Inversión pública eficiente'],
    hojaVida: 'https://ejemplo.pe/cv-silva',
    edad: 55,
    profesion: 'Economista'
  },
  {
    id: 6,
    nombre: 'Lucía Fernández Rojas',
    partido: 'ADP',
    cargo: 'Vicepresidencia',
    experiencia: [
      'Ex Ministra de Relaciones Exteriores',
      'Embajadora en Estados Unidos',
      'Catedrática de Derecho Internacional',
      'Negociadora de tratados comerciales'
    ],
    educacion: [
      'Doctorado en Derecho Internacional - Georgetown University',
      'Maestría en Relaciones Internacionales - Sciences Po',
      'Derecho - PUCP'
    ],
    propuestas: ['Inserción internacional', 'Diplomacia comercial'],
    hojaVida: 'https://ejemplo.pe/cv-fernandez',
    edad: 49,
    profesion: 'Internationalista'
  }
];

const NOTICIAS_DATA: Noticia[] = [
  {
    id: 1,
    titulo: 'Debate presidencial: candidatos presentan sus propuestas económicas',
    resumen: 'Los ocho candidatos presidenciales debatieron durante tres horas sobre medidas para reactivar la economía, combatir la inflación y generar empleo en el primer debate organizado por el JNE.',
    fecha: '2024-03-15',
    fuente: 'Diario El Comercio',
    url: 'https://ejemplo.pe/noticia1',
    categoria: 'Debates'
  },
  {
    id: 2,
    titulo: 'JNE presenta plataforma digital para consulta de hojas de vida',
    resumen: 'El Jurado Nacional de Elecciones implementó nuevo sistema tecnológico que permite verificar en tiempo real la información académica y profesional de todos los candidatos a cargos de elección popular.',
    fecha: '2024-03-14',
    fuente: 'Andina Noticias',
    url: 'https://ejemplo.pe/noticia2',
    categoria: 'Institucional'
  },
  {
    id: 3,
    titulo: 'ONPE anuncia cronograma oficial de elecciones generales 2024',
    resumen: 'La Oficina Nacional de Procesos Electorales detalló las fechas clave para las votaciones, conteo de votos y publicación de resultados oficiales del proceso electoral.',
    fecha: '2024-03-12',
    fuente: 'Gestión',
    url: 'https://ejemplo.pe/noticia3',
    categoria: 'Proceso Electoral'
  }
];

const SECTORES_DATA = [
  { 
    icon: <Heart size={24} color="#FFFFFF" />, 
    nombre: 'Salud', 
    color: '#DC2626',
    propuestas: [
      'Universalización del Seguro Integral de Salud',
      'Construcción de 100 nuevos centros de salud',
      'Programa nacional de prevención de enfermedades',
      'Digitalización de historias clínicas'
    ]
  },
  { 
    icon: <GraduationCap size={24} color="#FFFFFF" />, 
    nombre: 'Educación', 
    color: '#2563EB',
    propuestas: [
      'Implementación de educación digital en todas las escuelas',
      'Capacitación docente continua',
      'Becas integrales para educación superior',
      'Infraestructura educativa moderna'
    ]
  },
  { 
    icon: <Briefcase size={24} color="#FFFFFF" />, 
    nombre: 'Economía', 
    color: '#059669',
    propuestas: [
      'Reactívate Perú: programa de reactivación económica',
      'Apoyo a MIPYMES y emprendedores',
      'Atracción de inversión extranjera',
      'Simplificación tributaria'
    ]
  },
  { 
    icon: <ShieldCheck size={24} color="#FFFFFF" />, 
    nombre: 'Seguridad', 
    color: '#7C3AED',
    propuestas: [
      'Modernización de la Policía Nacional',
      'Sistema integrado de emergencias',
      'Prevención del delito comunitario',
      'Reforma del sistema penitenciario'
    ]
  },
  { 
    icon: <TreePine size={24} color="#FFFFFF" />, 
    nombre: 'Medio Ambiente', 
    color: '#16A34A',
    propuestas: [
      'Transición a energías renovables',
      'Protección de bosques primarios',
      'Manejo sostenible de recursos hídricos',
      'Economía circular nacional'
    ]
  },
  { 
    icon: <Car size={24} color="#FFFFFF" />, 
    nombre: 'Infraestructura', 
    color: '#EA580C',
    propuestas: [
      'Red nacional de carreteras interconectadas',
      'Modernización de puertos y aeropuertos',
      'Vivienda social sostenible',
      'Agua y saneamiento para todos'
    ]
  },
  { 
    icon: <Wifi size={24} color="#FFFFFF" />, 
    nombre: 'Tecnología', 
    color: '#0891B2',
    propuestas: [
      'Conectividad digital nacional',
      'Gobierno electrónico integral',
      'Impulso a la industria tech',
      'Ciberseguridad nacional'
    ]
  },
  { 
    icon: <Scale size={24} color="#FFFFFF" />, 
    nombre: 'Justicia', 
    color: '#CA8A04',
    propuestas: [
      'Reforma del sistema judicial',
      'Lucha contra la corrupción',
      'Acceso a justicia gratuita',
      'Modernización de procesos judiciales'
    ]
  }
];

export default function ElectoralApp() {
  const [activeSection, setActiveSection] = useState('partidos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;

  const openURL = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Error opening URL:', err));
  };

  const renderPartidos = () => (
    <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Building size={24} color="#8B1538" />
          <Text style={styles.sectionTitle}>
            {PARTIDOS_DATA.length} Partidos Políticos Registrados
          </Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Conoce las propuestas y planes de gobierno de cada organización política
        </Text>
      </View>

      <View style={[styles.grid, isTablet && styles.gridTablet]}>
        {PARTIDOS_DATA.map((partido) => (
          <View key={partido.id} style={[styles.partidoCard, isTablet && styles.partidoCardTablet]}>
            <View style={styles.partidoHeader}>
              <View style={[styles.partidoLogo, { backgroundColor: partido.color }]}>
                <Text style={styles.partidoAcronimo}>{partido.acronimo}</Text>
              </View>
              <View style={styles.partidoInfo}>
                <Text style={styles.partidoNombre}>{partido.nombre}</Text>
                <Text style={styles.partidoFundacion}>Fundado en {partido.fundacion}</Text>
                <View style={styles.ideologiaContainer}>
                  {partido.ideologia.map((ideologia, index) => (
                    <View key={index} style={styles.ideologiaChip}>
                      <Text style={styles.ideologiaText}>{ideologia}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.candidatosInfo}>
              <View style={styles.candidatoItem}>
                <UserCheck size={16} color="#6B7280" />
                <Text style={styles.candidatoText}>{partido.candidato}</Text>
              </View>
              <View style={styles.candidatoItem}>
                <Award size={16} color="#6B7280" />
                <Text style={styles.candidatoText}>{partido.vicepresidente}</Text>
              </View>
            </View>

            <View style={styles.propuestasSection}>
              <Text style={styles.propuestasTitle}>Propuestas principales:</Text>
              {partido.propuestas.slice(0, 3).map((propuesta, index) => (
                <View key={index} style={styles.propuestaItem}>
                  <View style={styles.propuestaBullet} />
                  <Text style={styles.propuestaText}>{propuesta}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.planButton}
              onPress={() => openURL(partido.planGobierno)}
            >
              <FileText size={18} color="#FFFFFF" />
              <Text style={styles.planButtonText}>Ver plan de gobierno completo</Text>
              <ExternalLink size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCandidatos = () => (
    <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Users size={24} color="#8B1538" />
          <Text style={styles.sectionTitle}>Candidatos a Elecciones Generales 2024</Text>
        </View>
      </View>

      <View style={styles.categoriaSection}>
        <Text style={styles.categoriaTitle}>🏛️ Planchas Presidenciales</Text>
        <View style={[styles.grid, isTablet && styles.gridTablet]}>
          {CANDIDATOS_DATA.filter(c => c.cargo === 'Presidencia').map(candidato => (
            <View key={candidato.id} style={[styles.candidatoCard, isTablet && styles.candidatoCardTablet]}>
              <View style={styles.candidatoHeader}>
                <View style={styles.candidatoFoto} />
                <View style={styles.candidatoInfo}>
                  <Text style={styles.candidatoNombre}>{candidato.nombre}</Text>
                  <Text style={styles.candidatoPartido}>{candidato.partido}</Text>
                  <Text style={styles.candidatoProfesion}>{candidato.profesion}</Text>
                  <Text style={styles.candidatoEdad}>{candidato.edad} años</Text>
                </View>
              </View>
              
              <View style={styles.candidatoDetalles}>
                <Text style={styles.detallesTitle}>Educación:</Text>
                {candidato.educacion.slice(0, 2).map((edu, index) => (
                  <Text key={index} style={styles.detalleItem}>• {edu}</Text>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.hojaVidaButton}
                onPress={() => openURL(candidato.hojaVida)}
              >
                <FileText size={16} color="#8B1538" />
                <Text style={styles.hojaVidaText}>Ver hoja de vida completa</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.categoriaSection}>
        <Text style={styles.categoriaTitle}>👥 Candidatos al Congreso</Text>
        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoon}>Información detallada disponible próximamente</Text>
          <Text style={styles.comingSoonSubtitle}>
            El JNE publicará la lista completa de candidatos al Congreso en las próximas semanas
          </Text>
        </View>
      </View>
    </View>
  );

  const renderPlanesGobierno = () => (
    <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <BookOpen size={24} color="#8B1538" />
          <Text style={styles.sectionTitle}>Planes de Gobierno por Sectores</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Compara las propuestas de todos los partidos organizadas por áreas temáticas
        </Text>
      </View>

      {selectedSector ? (
        <View style={styles.sectorDetalle}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedSector(null)}
          >
            <Text style={styles.backButtonText}>← Volver a sectores</Text>
          </TouchableOpacity>
          
          <Text style={styles.sectorDetalleTitle}>
            Propuestas para {selectedSector}
          </Text>
          
          <View style={styles.propuestasComparadas}>
            {PARTIDOS_DATA.map(partido => (
              <View key={partido.id} style={styles.partidoPropuestas}>
                <View style={styles.partidoHeader}>
                  <View style={[styles.partidoLogoSmall, { backgroundColor: partido.color }]}>
                    <Text style={styles.partidoAcronimoSmall}>{partido.acronimo}</Text>
                  </View>
                  <Text style={styles.partidoNombreSmall}>{partido.nombre}</Text>
                </View>
                <View style={styles.propuestasList}>
                  {partido.propuestas.slice(0, 2).map((propuesta, index) => (
                    <Text key={index} style={styles.propuestaComparada}>• {propuesta}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={[styles.sectoresGrid, isTablet && styles.sectoresGridTablet]}>
          {SECTORES_DATA.map((sector, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.sectorCard, isTablet && styles.sectorCardTablet]}
              onPress={() => setSelectedSector(sector.nombre)}
            >
              <View style={[styles.sectorIcon, { backgroundColor: sector.color }]}>
                {sector.icon}
              </View>
              <Text style={styles.sectorNombre}>{sector.nombre}</Text>
              <Text style={styles.sectorDescripcion}>
                {sector.propuestas.length} propuestas principales
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderNoticias = () => (
    <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Newspaper size={24} color="#8B1538" />
          <Text style={styles.sectionTitle}>Últimas Noticias Electorales</Text>
        </View>
      </View>

      <View style={[styles.grid, isTablet && styles.gridTablet]}>
        {NOTICIAS_DATA.map((noticia) => (
          <TouchableOpacity 
            key={noticia.id} 
            style={[styles.noticiaCard, isTablet && styles.noticiaCardTablet]}
            onPress={() => openURL(noticia.url)}
          >
            <View style={styles.noticiaHeader}>
              <View style={styles.noticiaCategoriaContainer}>
                <Text style={styles.noticiaCategoria}>{noticia.categoria}</Text>
              </View>
              <Text style={styles.noticiaFecha}>{noticia.fecha}</Text>
            </View>
            <Text style={styles.noticiaTitulo}>{noticia.titulo}</Text>
            <Text style={styles.noticiaResumen}>{noticia.resumen}</Text>
            <View style={styles.noticiaFooter}>
              <Text style={styles.noticiaFuente}>{noticia.fuente}</Text>
              <ExternalLink size={14} color="#8B1538" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderDatos = () => (
    <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <BarChart3 size={24} color="#8B1538" />
          <Text style={styles.sectionTitle}>Datos y Estadísticas Electorales</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{PARTIDOS_DATA.length}</Text>
          <Text style={styles.statLabel}>Partidos Políticos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{CANDIDATOS_DATA.length}</Text>
          <Text style={styles.statLabel}>Candidatos Registrados</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Sectores de Gobierno</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>25M</Text>
          <Text style={styles.statLabel}>Electores Habilitados</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoBoxTitle}>Próximos Pasos del Proceso Electoral</Text>
        <View style={styles.timeline}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <Text style={styles.timelineText}>15 Abril: Debate Presidencial</Text>
          </View>
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <Text style={styles.timelineText}>30 Abril: Cierre de Campaña</Text>
          </View>
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <Text style={styles.timelineText}>12 Mayo: Elecciones Generales</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const navItems = [
    { id: 'partidos', label: 'Partidos', icon: <Building size={20} color="currentColor" /> },
    { id: 'candidatos', label: 'Candidatos', icon: <Users size={20} color="currentColor" /> },
    { id: 'planes', label: 'Planes', icon: <BookOpen size={20} color="currentColor" /> },
    { id: 'noticias', label: 'Noticias', icon: <Newspaper size={20} color="currentColor" /> },
    { id: 'datos', label: 'Datos', icon: <BarChart3 size={20} color="currentColor" /> },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Principal */}
      <View style={styles.mainHeader}>
        <View style={[styles.headerContent, isDesktop && styles.headerContentDesktop]}>
          <View style={styles.logoContainer}>
            <Shield size={isDesktop ? 40 : 32} color="#8B1538" />
            <View style={styles.headerText}>
              <Text style={[styles.mainTitle, isDesktop && styles.mainTitleDesktop]}>
                Portal Electoral 2024
              </Text>
              <Text style={[styles.mainSubtitle, isDesktop && styles.mainSubtitleDesktop]}>
                Voto Informado - Democracia Fortalecida
              </Text>
            </View>
          </View>
          {isDesktop && (
            <View style={styles.desktopNav}>
              {navItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.desktopNavItem,
                    activeSection === item.id && styles.desktopNavItemActive
                  ]}
                  onPress={() => setActiveSection(item.id)}
                >
                  {item.icon}
                  <Text style={[
                    styles.desktopNavLabel,
                    activeSection === item.id && styles.desktopNavLabelActive
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Navegación Mobile/Tablet */}
      {!isDesktop && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.navScroll}
          contentContainerStyle={styles.navContainer}
        >
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.navItem,
                activeSection === item.id && styles.navItemActive
              ]}
              onPress={() => setActiveSection(item.id)}
            >
              {item.icon}
              <Text style={[
                styles.navLabel,
                activeSection === item.id && styles.navLabelActive
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Barra de búsqueda */}
      <View style={[styles.searchSection, isDesktop && styles.searchSectionDesktop]}>
        <View style={[styles.searchContainer, isDesktop && styles.searchContainerDesktop]}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={[styles.searchInput, isDesktop && styles.searchInputDesktop]}
            placeholder="Buscar partidos, candidatos, propuestas..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Contenido Principal */}
      <ScrollView 
        style={styles.contentScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta Informativa */}
        <View style={[styles.infoCard, isDesktop && styles.infoCardDesktop]}>
          <View style={styles.infoIcon}>
            <Vote size={24} color="#8B1538" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Ejerce tu Derecho al Voto Informado</Text>
            <Text style={styles.infoText}>
              Consulta toda la información oficial de candidatos, partidos políticos y sus planes de gobierno. 
              Un voto consciente y bien fundamentado es la base de una democracia sólida y representativa.
            </Text>
          </View>
        </View>

        {/* Renderizado condicional de secciones */}
        {activeSection === 'partidos' && renderPartidos()}
        {activeSection === 'candidatos' && renderCandidatos()}
        {activeSection === 'planes' && renderPlanesGobierno()}
        {activeSection === 'noticias' && renderNoticias()}
        {activeSection === 'datos' && renderDatos()}

        {/* Información Oficial */}
        <View style={[styles.officialNote, isDesktop && styles.officialNoteDesktop]}>
          <Shield size={20} color="#8B1538" />
          <View style={styles.officialContent}>
            <Text style={styles.officialTitle}>Fuente de Información Oficial</Text>
            <Text style={styles.officialText}>
              Todos los datos son proporcionados y verificados por el Jurado Nacional de Elecciones (JNE), 
              la Oficina Nacional de Procesos Electorales (ONPE) y el Registro Nacional de Identificación 
              y Estado Civil (RENIEC). Consulta las fuentes primarias para información actualizada y verificada.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});