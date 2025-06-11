import { Chat, Message, ServiceItem, UpcomingClass } from '@/types/props';

// Mock data for chats and users
export const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    name: 'Miguel Torres',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    lastMessage: '¿Puedes compartirme el enlace para la clase de guitarra?',
    timestamp: '12:34',
    unread: 2,
    online: true,
    blocked: false,
    service: 'Clases de Guitarra para Principiantes',
  },
  {
    id: '2',
    name: 'Sofía Chen',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    lastMessage: 'La clase de cocina italiana fue genial, gracias.',
    timestamp: '10:15',
    unread: 0,
    online: false,
    blocked: false,
    service: 'Clase Magistral de Cocina Italiana',
  },
  {
    id: '3',
    name: 'Alejandro Jiménez',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
    lastMessage: 'Te enviaré los detalles de la consultoría web mañana.',
    timestamp: 'Ayer',
    unread: 0,
    online: true,
    blocked: false,
    service: 'Consultoría de Desarrollo Web',
  },
  {
    id: '4',
    name: 'Laura García',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    lastMessage: 'Tienes bloqueado a este usuario',
    timestamp: '2 jun',
    unread: 0,
    online: false,
    blocked: true,
    service: 'Tutoría de Matemáticas',
  },
  {
    id: '5',
    name: 'Carlos Rodríguez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    lastMessage: '¿Cuándo podemos agendar la próxima sesión?',
    timestamp: '25 may',
    unread: 1,
    online: true,
    blocked: false,
    service: 'Entrenamiento Personal',
  },
];

// Mock messages for conversation
export const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    senderId: 'user1',
    text: 'Hola Miguel, ¿cómo estás? Estoy listo para nuestra clase de guitarra de hoy.',
    timestamp: '12:25',
    status: 'read',
  },
  {
    id: '2',
    senderId: '1',
    text: 'Hola! Estoy muy bien, gracias. ¿Puedes confirmarme que tienes una guitarra lista y afinada para la clase?',
    timestamp: '12:27',
    status: 'read',
  },
  {
    id: '3',
    senderId: 'user1',
    text: 'Sí, ya la tengo preparada. También tengo la púa y la aplicación de afinador instalada como sugeriste.',
    timestamp: '12:28',
    status: 'read',
  },
  {
    id: '4',
    senderId: '1',
    text: '¡Perfecto! Empezaremos repasando los acordes básicos que vimos en la clase anterior, y luego aprenderemos un par de nuevos. ¿Puedes compartirme el enlace para la clase de guitarra?',
    timestamp: '12:30',
    status: 'read',
  },
  {
    id: '5',
    senderId: 'user1',
    text: 'Claro, aquí está el enlace de la videollamada para la clase:',
    timestamp: '12:32',
    status: 'read',
  },
  {
    id: '6',
    senderId: 'user1',
    text: 'https://switchera.app/room/guitar-class-123',
    timestamp: '12:32',
    status: 'sent',
  },
];

// Mock upcoming classes
export const MOCK_UPCOMING_CLASSES: UpcomingClass[] = [
  {
    id: '1',
    title: 'Guitarra para Principiantes - Clase 3',
    instructor: 'Miguel Torres',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    date: '10 Jun 2025',
    time: '15:00 - 16:00',
    status: 'scheduled', // scheduled, in-progress, completed
  },
  {
    id: '2',
    title: 'Consultoría de Desarrollo Web',
    instructor: 'Alejandro Jiménez',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
    date: '12 Jun 2025',
    time: '10:00 - 11:00',
    status: 'scheduled',
  },
];

export const FEATURED_SERVICES = [
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

// Mock services for the services page
export const services: ServiceItem[] = [
  {
    id: "service1",
    userId: "user123",
    userImage: "https://randomuser.me/api/portraits/men/32.jpg",
    userName: "Alex Johnson",
    title: "Web Development Basics",
    description: "Learn HTML, CSS and JavaScript fundamentals to build your first website from scratch. Perfect for beginners!",
    price: 0,
    rating: 4.5,
    ratingCount: 18,
    duration: 60,
    modality: "online",
    category: "Programming",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    status: "all",
    isBooked: false,
    isSaved: true,
    tags: ["HTML", "CSS", "JavaScript", "Beginner"],
    timeAvailability: {
      '2025-06-12': ['09:00', '11:00', '16:00'],
      '2025-06-13': ['10:00', '14:00', '18:00'],
      '2025-06-14': ['09:00', '13:00', '17:00']
    }
  },
  {
    id: "service2",
    userId: "user456",
    userImage: "https://randomuser.me/api/portraits/women/44.jpg",
    userName: "Maria Garcia",
    title: "Spanish Conversation Practice",
    description: "Practice your Spanish speaking skills with a native speaker. All levels welcome!",
    price: 25,
    rating: 5,
    ratingCount: 32,
    duration: 45,
    modality: "both",
    category: "Languages",
    imageUrl: "https://images.unsplash.com/photo-1616165415772-f5b95c3ae135",
    status: "booked",
    isBooked: true,
    isSaved: false,
    tags: ["Spanish", "Speaking", "Conversation", "All Levels"],
    timeAvailability: {
      '2025-06-15': ['10:00', '15:30'],
      '2025-06-16': ['11:00', '16:00'],
      '2025-06-18': ['09:30', '14:00', '19:00']
    }
  },
  {
    id: "service3",
    userId: "user789",
    userImage: "https://randomuser.me/api/portraits/men/65.jpg",
    userName: "John Smith",
    title: "Guitar Lessons for Beginners",
    description: "Start your musical journey with easy-to-follow guitar lessons. No experience required.",
    price: 15,
    rating: 4.8,
    ratingCount: 22,
    duration: 30,
    modality: "in-person",
    category: "Music",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    status: "saved",
    isBooked: false,
    isSaved: true,
    tags: ["Guitar", "Beginner", "Music", "Lessons"],
    timeAvailability: {
      '2025-06-11': ['08:00', '10:00', '14:00', '16:00'],
      '2025-06-12': ['09:00', '15:00', '17:00'],
      '2025-06-13': ['08:30', '13:00', '18:30']
    }
  },
];

