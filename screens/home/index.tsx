import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Calendar, Clock, Heart, MessageSquare, PenTool, Repeat, Search, Shield, Star, ThumbsUp, UserCircle, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LoginNavButton from '@/components/common/NavButtons/LoginNavButton';
import RegisterNavButton from '@/components/common/NavButtons/RegisterNavButton';
import ServiceNavButton from '@/components/common/NavButtons/ServiceNavButton';
import Section from '@/components/homePage/Section';
import ServiceCard from '@/components/servicePage/ServiceCard';


// Constantes simples para espaciado y estilos consistentes
const MAX_CONTENT_WIDTH = 1200;
const MOBILE_CARD_WIDTH = 500;
const ACCENT_COLOR = '#84cc16';
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Imágenes de fondo para la versión desktop
const backgroundImages = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071', // Personas hablando
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070', // Persona con gafas en ordenador
  'https://images.unsplash.com/photo-1607914660217-754fdd90041d?q=80&w=2070', // Clase de yoga/gimnasia
];

export default function HomeScreen() {
  // Obtiene las dimensiones del dispositivo para adaptar el diseño
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const insets = useSafeAreaInsets();
  
  // Estado para cambiar las imágenes de fondo en desktop
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const opacity = useSharedValue(1);
  
  const featuredServices = [
    {
      id: '1',
      userId: 'user1',
      userImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      userName: 'Miguel Torres',
      title: 'Clases de Guitarra para Principiantes',
      description: 'Sesión de 1 hora enseñando acordes básicos y técnicas para principiantes. Todas las edades son bienvenidas. Aprenderás a tocar tus primeras canciones desde la primera clase.',
      fullDescription: 'En estas clases personalizadas de guitarra, aprenderás los fundamentos para empezar a tocar desde cero: posición correcta de las manos, afinación básica, acordes esenciales, y técnicas de rasgueo. Después de las primeras sesiones, estarás tocando canciones populares adaptadas a tu nivel. El curso está diseñado para cualquier edad, no se requiere experiencia musical previa. Incluye material didáctico digital y apoyo entre sesiones para resolver dudas. ¡Aprende a tu ritmo y disfruta del proceso!',
      price: 25.00,
      rating: 4.8,
      ratingCount: 24,
      duration: 60,
      modality: 'both',
      category: 'Música',
      imageUrl: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f',
      timeAvailability: {
        '2025-06-15': ['09:00', '11:00', '16:00'],
        '2025-06-16': ['10:00', '14:00', '18:00'],
        '2025-06-17': ['09:00', '13:00', '17:00']
      }
    },
    {
      id: '2',
      userId: 'user2',
      userImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
      userName: 'Sofía Chen',
      title: 'Clase Magistral de Cocina Italiana',
      description: 'Aprende a preparar auténticos platos de pasta desde cero con técnicas tradicionales y recetas familiares. Incluye secretos de la cocina mediterránea.',
      fullDescription: 'Descubre los secretos de la auténtica cocina italiana con esta clase magistral interactiva. Aprenderás a preparar pasta fresca casera desde cero, salsas tradicionales como la carbonara genuina o la boloñesa lenta, y conocerás los ingredientes imprescindibles de la despensa italiana. Las recetas han sido transmitidas en mi familia por generaciones y adaptadas para que puedas recrearlas fácilmente en casa. La clase incluye lista de compras anticipada, consejos para sustituciones de ingredientes y técnicas profesionales de emplatado. ¡Una experiencia culinaria completa que transportará tu paladar a Italia!',
      price: 35.00,
      rating: 5.0,
      ratingCount: 38,
      duration: 90,
      modality: 'online',
      category: 'Gastronomía',
      imageUrl: 'https://images.unsplash.com/photo-1556911073-a517e752729c',
      timeAvailability: {
        '2025-06-14': ['10:00', '15:30'],
        '2025-06-15': ['11:00', '16:00'],
        '2025-06-18': ['09:30', '14:00', '19:00']
      }
    },
    {
      id: '3',
      userId: 'user3',
      userImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
      userName: 'Alejandro Jiménez',
      title: 'Consultoría de Desarrollo Web',
      description: 'Asesoría personalizada para construir tu sitio web con principios de diseño moderno y layouts responsivos. Especializado en React y Next.js.',
      fullDescription: 'Ofrezco sesiones de consultoría personalizada para desarrolladores web y emprendedores que buscan mejorar o crear desde cero sus proyectos digitales. Con más de 8 años de experiencia en el sector, te ayudaré a resolver problemas específicos de código, optimizar el rendimiento de tu sitio, implementar las mejores prácticas de SEO técnico, o planificar la arquitectura completa de tu aplicación. Me especializo en tecnologías modernas como React, Next.js, y TailwindCSS, pero puedo adaptarme a cualquier stack tecnológico. Las sesiones incluyen seguimiento posterior por email y acceso a recursos exclusivos. Invierte en conocimiento experto para hacer despegar tu proyecto web.',
      price: 50.00,
      rating: 5.0,
      ratingCount: 17,
      duration: 60,
      modality: 'online',
      category: 'Desarrollo Web',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      timeAvailability: {
        '2025-06-11': ['08:00', '10:00', '14:00', '16:00'],
        '2025-06-12': ['09:00', '15:00', '17:00'],
        '2025-06-13': ['08:30', '13:00', '18:30']
      }
    }
  ];

  

  // Efecto para cambiar la imagen de fondo cada 5 segundos en desktop
  useEffect(() => {
    if (isDesktop) {
      const interval = setInterval(() => {
        // Animación de desvanecimiento
        opacity.value = withTiming(0, { duration: 1000 }, () => {
          setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
          opacity.value = withTiming(1, { duration: 1000 });
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isDesktop]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // Usa StyleSheet para crear estilos reutilizables
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      maxWidth: MAX_CONTENT_WIDTH,
      alignSelf: 'center',
    },
    backgroundImage: {
      width: '100%',
      height: SCREEN_HEIGHT - insets.top - insets.bottom,
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    serviceCard: {
      width: isDesktop ? 360 : MOBILE_CARD_WIDTH,
      marginRight: 16,
      borderRadius: 16,
    },
    centeredContainer: {
      width: '100%',
      maxWidth: MAX_CONTENT_WIDTH,
      alignSelf: 'center',
      alignItems: 'center',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    featureCard: {
      width: isDesktop ? '30%' : '100%',
      marginBottom: 16,
      borderRadius: 16,
      padding: 20,
    },
    callToActionButton: {
      backgroundColor: '#3B82F6',
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 12,
      marginTop: 24,
      marginBottom: 40,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    stepCard: {
      marginBottom: 16,
      borderRadius: 16,
      padding: 0,
      overflow: 'hidden',
    },
    stepCardContent: {
      padding: 20,
    },
    stepImage: {
      width: '100%',
      height: 200,
    },
    stepIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#EBF5FF',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    stepNumber: {
      position: 'absolute',
      top: 16,
      right: 16,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: '#3B82F6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    stepNumberText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="bg-gray-50">
        
        {/* Hero Section - Cambia el fondo en desktop o muestra imagen fija en móvil */}
        {isDesktop ? (
          <Animated.View style={[animatedStyle]}>
            <ImageBackground
              source={{ uri: backgroundImages[currentBgIndex] }}
              style={styles.backgroundImage}
              resizeMode="cover"
            >
              <View style={styles.overlay}>
          <VStack className="items-center justify-center py-16 space-y-8" style={styles.centeredContainer}>
            <Heading size="4xl" className="text-white text-center font-bold">
              Switchera
            </Heading>
            <Text className="text-white text-xl text-center px-4 max-w-lg">
              Intercambia habilidades, conoce personas y crece profesionalmente
            </Text>
            <TouchableOpacity
              style={styles.callToActionButton}
              onPress={() => {
                const section = document.getElementById('first-steps-section');
                if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <Text className="text-white font-bold text-center text-lg">
                ¡Empieza ahora!
              </Text>
            </TouchableOpacity>
          </VStack>
              </View>
            </ImageBackground>
          </Animated.View>
        ) : (
          <ImageBackground
            source={{ uri: backgroundImages[0] }}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.overlay}>
              <VStack className="items-center justify-center py-16 space-y-8" style={styles.centeredContainer}>
          <Heading size="4xl" className="text-white text-center font-bold">
            Switchera
          </Heading>
          <Text className="text-white text-xl text-center px-4 max-w-lg">
            Intercambia habilidades, conoce personas y crece profesionalmente
          </Text>
          <TouchableOpacity
            style={styles.callToActionButton}
            onPress={() => {
              const section = typeof document !== 'undefined'
                ? document.getElementById('first-steps-section')
                : null;
              if (section && typeof section.scrollIntoView === 'function') {
                section.scrollIntoView({ behavior: 'smooth' });
              }
              // En React Native, puedes usar scrollTo, pero aquí depende de tu estructura de ScrollView
              // Si necesitas soporte nativo, deberías usar un ref y scrollTo({ y: ... })
            }}
          >
            


          </TouchableOpacity>
              </VStack>
            </View>
          </ImageBackground>
        )}
  


        {/* Sección de Primeros Pasos */}
        <View className="w-full bg-white border-t border-gray-100"
            {...(typeof document !== 'undefined'
            ? { id: 'first-steps-section' }
            : { nativeID: 'first-steps-section' })}
        >
          <Section backgroundColor='bg-white'>
            <VStack space="md" style={styles.container}>
              <Text className="text-4xl font-bold text-gray-800 mb-4 text-center">Como empezar</Text>
              <Text className="text-gray-600 text-center mb-8">
                Descubre cómo sacar el máximo partido a nuestra plataforma de intercambio de habilidades
              </Text>
              
              {/* Paso 1: Crea tu perfil */}
              <Card style={styles.stepCard}>
                <View style={styles.stepCardContent}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepIconContainer}>
                    <UserCircle size={28} color="#3b82f6" />
                  </View>
                  <Heading size="lg" className="mb-2">Crea tu perfil</Heading>
                  <Text className="text-gray-600 mb-4">
                    Personaliza tu perfil para mostrar quién eres, tus intereses y qué habilidades deseas compartir. 
                    Una foto profesional, una descripción detallada y enlaces a tus redes sociales aumentarán tus posibilidades 
                    de encontrar las mejores conexiones.
                  </Text>
                  <TouchableOpacity className="bg-gray-100 rounded-full py-2 px-4 self-start">
                    <Text className="text-blue-800 font-medium">Personalizar perfil</Text>
                  </TouchableOpacity>
                </View>
              </Card>
              
              {/* Paso 2: Publica tus servicios */}
              <Card style={styles.stepCard}>

                <View style={styles.stepCardContent}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepIconContainer}>
                    <PenTool size={28} color="#3b82f6" />
                  </View>
                  <Heading size="lg" className="mb-2">Publica tus servicios</Heading>
                  <Text className="text-gray-600 mb-4">
                    Comparte tus conocimientos y habilidades creando servicios atractivos. Detalla lo que puedes enseñar, 
                    incluye imágenes llamativas y establece tu disponibilidad. Recuerda que puedes optar por un intercambio 
                    directo de habilidades o establecer un precio para tus servicios.
                  </Text>
                  <HStack space="md">
                    <TouchableOpacity className="bg-gray-100 rounded-full py-2 px-4">
                      <Text className="text-blue-800 font-medium">Crear servicio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-blue-500 rounded-full py-2 px-4">
                      <Text className="text-white font-medium">Ver ejemplos</Text>
                    </TouchableOpacity>
                  </HStack>
                </View>
              </Card>
              
              {/* Paso 3: Conecta con otros usuarios */}
              <Card style={styles.stepCard}>
                <View style={styles.stepCardContent}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepIconContainer}>
                    <Users size={28} color="#3b82f6" />
                  </View>
                  <Heading size="lg" className="mb-2">Conecta con la comunidad</Heading>
                  <Text className="text-gray-600 mb-4">
                    Descubre perfiles afines y servicios que te interesen. En Switchera puedes interactuar con otros usuarios 
                    reaccionando a sus publicaciones, siguiéndoles o enviándoles mensajes directos para conocerlos mejor. Nuestro 
                    sistema de recomendaciones te mostrará conexiones relevantes según tus intereses.
                  </Text>
                  <VStack space="sm">
                    <HStack className="mb-2">
                      <View className="bg-blue-50 p-2 rounded-full mr-2">
                        <Search size={18} color="#3b82f6" />
                      </View>
                      <Text className="text-gray-700">Busca por categorías o habilidades</Text>
                    </HStack>
                    <HStack className="mb-2">
                      <View className="bg-blue-50 p-2 rounded-full mr-2">
                        <Heart size={18} color="#3b82f6" />
                      </View>
                      <Text className="text-gray-700">Guarda servicios para verlos más tarde</Text>
                    </HStack>
                    <HStack>
                      <View className="bg-blue-50 p-2 rounded-full mr-2">
                        <ThumbsUp size={18} color="#3b82f6" />
                      </View>
                      <Text className="text-gray-700">Reacciona y comenta en publicaciones</Text>
                    </HStack>
                  </VStack>
                </View>
              </Card>
              
              {/* Paso 4: Chatea y agenda */}
              <Card style={styles.stepCard}>

                <View style={styles.stepCardContent}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>4</Text>
                  </View>
                  <View style={styles.stepIconContainer}>
                    <MessageSquare size={28} color="#3b82f6" />
                  </View>
                  <Heading size="lg" className="mb-2">Chatea y agenda sesiones</Heading>
                  <Text className="text-gray-600 mb-4">
                    Nuestro chat integrado te permite hablar directamente con tus profesores o alumnos de manera simple y amigable. 
                    Comparte archivos, imágenes o enlaces útiles para preparar tus sesiones. Usa nuestro sistema de calendario para 
                    programar tus intercambios sin complicaciones.
                  </Text>
                  
                  <Card className="bg-gray-50 p-4 mb-4">
                    <HStack className="items-start">

                      <VStack style={{flex: 1}}>
                        <Text className="text-sm font-semibold text-gray-800">Sofía:</Text>
                        <Text className="text-sm text-gray-600">Hola! Me encantaría tomar una clase contigo el próximo jueves. ¿Tienes disponibilidad? 😊</Text>
                        <HStack className="mt-2">
                          <Text className="text-xs text-gray-400">12:30</Text>
                        </HStack>
                      </VStack>
                    </HStack>
                    
                    <HStack className="items-start mt-4 justify-end">
                      <VStack style={{alignItems: 'flex-end', flex: 1}}>
                        <Text className="text-sm font-semibold text-right text-gray-800">Tú:</Text>
                        <Text className="text-sm text-gray-600 text-right">¡Claro que sí! Tengo horario libre de 16:00 a 19:00. ¿Qué hora te vendría mejor?</Text>
                        <HStack className="mt-2">
                          <Text className="text-xs text-gray-400">12:32</Text>
                        </HStack>
                      </VStack>

                    </HStack>
                  </Card>
                  
                  <HStack space="md">
                    <View className="bg-blue-50 p-2 rounded-full mr-2">
                      <Calendar size={18} color="#3b82f6" />
                    </View>
                    <Text className="text-gray-700">El sistema de calendario te ayuda a gestionar todas tus sesiones</Text>
                  </HStack>
                </View>
              </Card>
              
              {/* Paso 5: Intercambia y aprende */}
              <Card style={styles.stepCard}>

                <View style={styles.stepCardContent}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>5</Text>
                  </View>
                  <View style={styles.stepIconContainer}>
                    <Repeat size={28} color="#3b82f6" />
                  </View>
                  <Heading size="lg" className="mb-2">Intercambia y aprende</Heading>
                  <Text className="text-gray-600 mb-4">
                    ¡Ha llegado el momento de compartir conocimientos! Disfruta aprendiendo y enseñando en un ambiente 
                    amigable y colaborativo. Después de cada sesión, puedes dejar reseñas para construir tu reputación en la 
                    plataforma y ayudar a otros miembros a tomar decisiones informadas.
                  </Text>
                  <Card className="bg-gray-50 p-4 mb-4">
                    <VStack space="md">
                      <HStack>
                        <Star size={16} color="#f59e0b" fill="#f59e0b" />
                        <Star size={16} color="#f59e0b" fill="#f59e0b" />
                        <Star size={16} color="#f59e0b" fill="#f59e0b" />
                        <Star size={16} color="#f59e0b" fill="#f59e0b" />
                        <Star size={16} color="#f59e0b" fill="#f59e0b" />
                      </HStack>
                      <Text className="text-sm text-gray-600 italic">
                        &quot;La clase de fotografía con Javier fue increíble! Me dio consejos muy útiles para mejorar mis técnicas 
                        y ahora mis fotos se ven mucho más profesionales. ¡Totalmente recomendado!&quot;
                      </Text>
                      <HStack space="md" className="items-center">

                        <Text className="text-sm font-semibold">Laura Martínez</Text>
                      </HStack>
                    </VStack>
                  </Card>
                </View>
              </Card>
            </VStack>
          </Section>
        </View>        

        
        {/* Sección de Características */}
        <View className="w-full bg-gray-50 border-t border-gray-100">
          <Section backgroundColor='bg-gray-50'>
            <VStack space="md" style={styles.container}>
              <Text className="text-4xl font-bold text-gray-800 mb-4 text-center">Características</Text>
              <Text className="text-gray-600 text-base text-center mb-8">Nuestra plataforma hace que el intercambio de habilidades sea simple y efectivo.</Text>
              
              <HStack space="md" className="flex-wrap justify-between">
                {/* Característica 1 */}
                <Card
                  style={styles.featureCard}
                  className="bg-white"
                >
                  <VStack space="md">
                    <View className="bg-blue-100 p-3 self-start rounded-lg">
                      <Clock size={24} color="#3b82f6" />
                    </View>
                    <Heading size="md">Eficiente</Heading>
                    <Text className="text-gray-600">Todas las sesiones son clases breves, facilitando el aprendizaje en tu horario ocupado.</Text>
                  </VStack>
                </Card>
                
                {/* Característica 2 */}
                <Card
                  style={styles.featureCard}
                  className="bg-white"
                >
                  <VStack space="md">
                    <View className="bg-blue-100 p-3 self-start rounded-lg">
                      <Users size={24} color="#3b82f6" />
                    </View>
                    <Heading size="md">Comunidad</Heading>
                    <Text className="text-gray-600">Únete a una red de personas dispuestas a compartir su conocimiento y aprender de otros.</Text>
                  </VStack>
                </Card>
                
                {/* Característica 3 */}
                <Card
                  style={styles.featureCard}
                  className="bg-white"
                >
                  <VStack space="md">
                    <View className="bg-blue-100 p-3 self-start rounded-lg">
                      <Shield size={24} color="#3b82f6" />
                    </View>
                    <Heading size="md">Seguro</Heading>
                    <Text className="text-gray-600">Nuestro sistema de verificación garantiza intercambios de calidad y un entorno seguro.</Text>
                  </VStack>
                </Card>
              </HStack>
            </VStack>
          </Section>
        </View>
        
        {/* Sección de Servicios Destacados */}
        <View
          className="w-full bg-white border-t border-gray-100"
        >
          <Section backgroundColor='bg-white'>
            <VStack space="md" style={styles.container}>
              <Text className="text-4xl font-bold text-gray-800 mb-4 text-center">Servicios Destacados</Text>
              <Text className="text-gray-600 text-center mb-6">
              Explora algunos de nuestros servicios más populares y mejor valorados
              </Text>
              
              {/* Servicios con datos reales usando ServiceCard */}
              <View style={{paddingHorizontal: 4}}>
          {featuredServices.map((service) => (
            <ServiceCard
              key={service.id}
              userId={service.userId}
              userImage={service.userImage}
              userName={service.userName}
              title={service.title}
              description={service.description}
              price={service.price}
              rating={service.rating}
              ratingCount={service.ratingCount}
              duration={service.duration as 30 | 45 | 60 | 90}
              modality={service.modality as 'online' | 'in-person' | 'both'}
              category={service.category}
              imageUrl={service.imageUrl}
              fullDescription={service.fullDescription}
              timeAvailability={service.timeAvailability as any}
            />
          ))}
          
          <ServiceNavButton/>
              </View>
            </VStack>
          </Section>
        </View>
        
        {/* Botón de llamado a la acción */}
        <View className="w-full bg-black">
          <Section backgroundColor='bg-black'>
            <VStack style={styles.centeredContainer} className="py-12">
              <Text className="text-3xl font-bold text-blue mb-6 text-center">
                ¿Listo para intercambiar conocimientos?
              </Text>
              <Text className="text-white text-center mb-8 max-w-md">
                Únete a nuestra comunidad de personas que comparten sus habilidades y aprenden cosas nuevas todos los días.
              </Text>
              <TouchableOpacity style={{
                backgroundColor: 'white',
                paddingVertical: 16,
                paddingHorizontal: 32,
                borderRadius: 12,
              }}>
                <Text className="text-blue-800 font-bold text-center text-lg">
                  Crea una cuenta totalmente gratis o inicia sesion!


                    <View className="flex flex-row justify-center mt-4 space-x-4">
                    <LoginNavButton />
                    <RegisterNavButton />
                    </View>
                </Text>
              </TouchableOpacity>
            </VStack>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}