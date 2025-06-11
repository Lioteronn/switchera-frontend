import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Chat } from '@/types/props';
import { BlurView } from 'expo-blur';
import { Camera, CameraType, CameraView } from 'expo-camera';
import { ArrowDownRightSquare, Grid, Mic, MicOff, Minimize2, PhoneOff, RotateCcw, Share2, Video, VideoOff } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, PanResponder, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface VideoCallUIProps {
  selectedChat: Chat;
  onEndCall: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  toggleMinimized?: () => void;
  allowChat?: boolean;
}

const VideoCallUI: React.FC<VideoCallUIProps> = ({ 
  selectedChat, 
  onEndCall,
  isMinimized = false,
  toggleMinimized,
  allowChat = true
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [webStream, setWebStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  
  // Para arrastrar en modo minimizado en móvil
  const pan = useRef(new Animated.ValueXY()).current;
  const windowDimensions = Dimensions.get('window');
  
  // Timer para ocultar controles automáticamente
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Solicitar permisos de cámara
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        
        // También solicitar permisos de audio
        const audioStatus = await Camera.requestMicrophonePermissionsAsync();
        if (audioStatus.status !== 'granted') {
          console.log('Se requiere permiso para acceder al micrófono');
        }
      } else {
        // En web, intentar obtener acceso a la cámara directamente
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          setWebStream(stream);
          setHasPermission(true);
        } catch (err) {
          console.log('Error al obtener permisos de cámara web:', err);
          setHasPermission(false);
        }
      }
    };
    
    requestPermissions();
    
    // Resetea el timer y streams cuando el componente se desmonta
    return () => {
      if (controlsTimer.current) {
        clearTimeout(controlsTimer.current);
      }
      
      // Limpiar streams de web
      if (Platform.OS === 'web') {
        if (webStream) {
          webStream.getTracks().forEach(track => track.stop());
        }
        if (screenStream) {
          screenStream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, []);
  
  // Efecto para conectar el stream web al elemento de video
  useEffect(() => {
    if (Platform.OS === 'web' && videoRef.current && webStream) {
      videoRef.current.srcObject = webStream;
    }
  }, [webStream]);
  
  // Efecto para conectar el stream de compartición de pantalla al elemento de video
  useEffect(() => {
    if (Platform.OS === 'web' && screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);
  
  // Resetea el timer de controles cuando se muestran
  useEffect(() => {
    if (isControlsVisible && !isMinimized) {
      if (controlsTimer.current) {
        clearTimeout(controlsTimer.current);
      }
      controlsTimer.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 5000);
    }
    
    return () => {
      if (controlsTimer.current) {
        clearTimeout(controlsTimer.current);
      }
    };
  }, [isControlsVisible, isMinimized]);
  
  // Configura el panResponder para arrastrar la ventana minimizada
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isMinimized,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        // Ajusta la posición final para que no salga de la pantalla
        const newX = Math.max(0, Math.min(windowDimensions.width - 150, gesture.moveX - 75));
        const newY = Math.max(insets.top, Math.min(windowDimensions.height - 200 - insets.bottom, gesture.moveY - 100));
        
        Animated.spring(pan, {
          toValue: { x: newX - (pan.x as any)._value, y: newY - (pan.y as any)._value },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;
  
  const handleFlipCamera = () => {
    if (Platform.OS === 'web') {
      // En web necesitamos recrear el stream con la cámara opuesta
      if (webStream) {
        const currentTracks = webStream.getTracks();
        currentTracks.forEach(track => track.stop());
        
        // Obtener la nueva facingMode
        const newFacingMode = facing === 'front' ? 'environment' : 'user';
        
        navigator.mediaDevices.getUserMedia({
          video: { facingMode: newFacingMode },
          audio: true
        }).then(newStream => {
          setWebStream(newStream);
          setFacing(current => current === 'front' ? 'back' : 'front');
        }).catch(err => {
          console.log('Error al cambiar cámara:', err);
        });
      }
    } else {
      // En móvil simplemente cambiamos el estado
      setFacing(current => current === 'back' ? 'front' : 'back');
    }
  };
  
  const toggleControls = () => {
    if (!isMinimized) {
      setIsControlsVisible(!isControlsVisible);
    }
  };
  
  const handleToggleVideo = () => {
    if (isVideoOff) {
      // Reactivar video
      if (Platform.OS === 'web' && webStream) {
        webStream.getVideoTracks().forEach(track => {
          track.enabled = true;
        });
      }
    } else {
      // Desactivar video
      if (Platform.OS === 'web' && webStream) {
        webStream.getVideoTracks().forEach(track => {
          track.enabled = false;
        });
      }
    }
    setIsVideoOff(!isVideoOff);
  };
  
  const handleToggleMute = () => {
    if (Platform.OS === 'web' && webStream) {
      webStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
  };
  
  const renderWebVideo = () => {
    if (!hasPermission) {
      return (
        <View style={{ flex: 1, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Sin acceso a cámara</Text>
          <TouchableOpacity 
            style={{ marginTop: 10, padding: 8, backgroundColor: '#555', borderRadius: 5 }}
            onPress={async () => {
              try {
                const stream = await navigator.mediaDevices.getUserMedia({
                  video: true,
                  audio: true
                });
                setWebStream(stream);
                setHasPermission(true);
              } catch (err) {
                console.log('Error al obtener permisos:', err);
              }
            }}
          >
            <Text style={{ color: '#fff' }}>Solicitar permisos</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isVideoOff) {
      return (
        <View style={{ flex: 1, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' }}>
          <VideoOff size={48} color="#666" />
          <Text style={{ color: '#aaa', marginTop: 12 }}>Cámara apagada</Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        {/* @ts-ignore - para HTML video element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMuted}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transform: facing === 'front' ? 'scaleX(-1)' : 'scaleX(1)'
          }}
        />
      </View>
    );
  };
  
  const renderCameraContent = () => {
    // Web - usa el elemento video HTML
    if (Platform.OS === 'web') {
      return renderWebVideo();
    }
    
    // Sin permisos de cámara
    if (hasPermission !== true) {
      return (
        <View style={{ flex: 1, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Sin acceso a cámara</Text>
        </View>
      );
    }
    
    // Cámara apagada
    if (isVideoOff) {
      return (
        <View style={{ flex: 1, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' }}>
          <VideoOff size={48} color="#666" />
          <Text style={{ color: '#aaa', marginTop: 12 }}>Cámara apagada</Text>
        </View>
      );
    }
    
    // Cámara normal para móvil - usando CameraView en lugar de Camera
    return (
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
      />
    );
  };
  
  const renderSelfVideo = () => {
    // Web
    if (Platform.OS === 'web') {
      if (!hasPermission || isVideoOff) {
        return (
          <View style={{ flex: 1, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' }}>
            <VideoOff size={24} color="#666" />
            <Text style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>
              {isVideoOff ? 'Cámara apagada' : 'Sin acceso a cámara'}
            </Text>
          </View>
        );
      }
      
      return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          {/* @ts-ignore - para HTML video element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={true} // Siempre silenciado para evitar eco
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transform: facing === 'back' ? 'scaleX(-1)' : 'scaleX(1)'
            }}
          />
        </View>
      );
    }
    
    // Sin permisos o cámara apagada
    if (!hasPermission || isVideoOff) {
      return (
        <View style={{ flex: 1, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' }}>
          <VideoOff size={24} color="#666" />
          <Text style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>
            {isVideoOff ? 'Cámara apagada' : 'Sin acceso a cámara'}
          </Text>
        </View>
      );
    }
    
    // Para los demos, usar una imagen simulada
    return (
      <Image
        source={require('@/assets/images/selfie-example.jpeg')} 
        style={{ flex: 1, resizeMode: 'cover' }}
      />
    );
  };

  const handleScreenShare = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Alert.alert(
        "Compartir pantalla", 
        "Esta función solo está disponible en la versión web",
        [{ text: "Entendido" }]
      );
      return;
    }
    
    try {
      if (isScreenSharing) {
        // Detener compartición de pantalla
        if (screenStream) {
          screenStream.getTracks().forEach(track => track.stop());
          setScreenStream(null);
        }
        setIsScreenSharing(false);
        return;
      }
      
      // @ts-ignore - TypeScript puede que no reconozca getDisplayMedia
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });
      
      setScreenStream(stream);
      setIsScreenSharing(true);
      
      // Detectar cuando el usuario detiene la compartición desde el navegador
      stream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
        setScreenStream(null);
      };
      
    } catch (error) {
      console.error('Error al compartir pantalla:', error);
      Alert.alert(
        "Error", 
        "No se pudo iniciar la compartición de pantalla",
        [{ text: "Entendido" }]
      );
    }
  }, [isScreenSharing, screenStream]);
  
  const renderScreenShare = () => {
    if (Platform.OS !== 'web') {
      return (
        <View style={{ flex: 1, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' }}>
          <Share2 size={48} color="#666" />
          <Text style={{ color: '#aaa', marginTop: 12 }}>Compartiendo pantalla (simulado)</Text>
        </View>
      );
    }
    
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        {/* @ts-ignore - para HTML video element */}
        <video
          ref={screenVideoRef}
          autoPlay
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        <View style={styles.screenShareOverlay}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Compartiendo pantalla</Text>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    minimizedContainer: {
      position: 'absolute',
      width: 150,
      height: 200,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.3)',
      zIndex: 1000,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    },
    mainVideoArea: {
      flex: 1,
      position: 'relative',
    },
    instructorOverlay: {
      position: 'absolute',
      top: insets.top + 10,
      left: 20,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
      zIndex: 10,
    },
    selfVideoContainer: {
      position: 'absolute',
      bottom: 80,
      right: 20,
      width: 150,
      height: 200,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.3)',
      zIndex: 10,
    },
    minimizeButton: {
      position: 'absolute',
      top: insets.top + 10,
      right: 20,
      zIndex: 11,
      padding: 8,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 20,
    },
    controlsContainer: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 10,
    },
    controlsRow: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 30,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    controlButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 5,
    },
    activeButton: {
      backgroundColor: '#64748b',
    },
    endCallButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#ef4444',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 5,
    },
    screenShareImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    cameraContainer: {
      flex: 1,
    },
    videoDisabledOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 5,
    },
    minimizedControls: {
      position: 'absolute',
      bottom: 5,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      zIndex: 15,
    },
    minimizedControlButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 3,
    },
    touchableArea: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 5,
    },
    screenShareOverlay: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
    }
  });

  // Si está minimizado, mostrar ventana flotante
  if (isMinimized) {
    return (
      <Animated.View
        style={[
          styles.minimizedContainer,
          { transform: [{ translateX: pan.x }, { translateY: pan.y }] }
        ]}
        {...panResponder.panHandlers}
      >
        {/* Video del instructor */}
        <View style={styles.cameraContainer}>
          {/* Usar la imagen del avatar en modo minimizado para mejor rendimiento */}
          <Image 
            source={{ uri: selectedChat.avatar }}
            style={{ width: '100%', height: '100%' }}
          />
          
          {/* Overlay para el indicador de nombre */}
          <View style={{ position: 'absolute', top: 5, left: 5, right: 5 }}>
            <BlurView intensity={70} tint="dark" style={{ padding: 4, borderRadius: 4 }}>
              <Text className="text-white text-xs" numberOfLines={1}>
                {selectedChat.name}
              </Text>
            </BlurView>
          </View>
          
          {/* Controles minimizados */}
          <View style={styles.minimizedControls}>
            <TouchableOpacity 
              style={styles.minimizedControlButton} 
              onPress={toggleMinimized}
            >
              <ArrowDownRightSquare size={16} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.minimizedControlButton, { backgroundColor: '#ef4444' }]} 
              onPress={onEndCall}
            >
              <PhoneOff size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Área de video principal */}
      <TouchableOpacity 
        activeOpacity={1}
        style={styles.touchableArea}
        onPress={toggleControls}
      >
        <View style={styles.mainVideoArea}>
          {isScreenSharing ? (
            renderScreenShare()
          ) : (
            <View style={styles.cameraContainer}>
              {/* Renderizar el video del instructor (usando imagen de avatar mientras desarrollamos) */}
              <Image 
                source={{ uri: selectedChat.avatar }} 
                style={{ flex: 1, resizeMode: 'cover' }} 
              />
            </View>
          )}

          {/* Overlay con nombre del instructor */}
          {isControlsVisible && (
            <BlurView 
              intensity={70} 
              tint="dark" 
              style={styles.instructorOverlay}
            >
              <HStack space="sm">
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' }} />
                <Text style={{ color: '#fff' }}>{selectedChat.name} · Instructor</Text>
              </HStack>
            </BlurView>
          )}

          {/* Video del usuario (abajo a la derecha) */}
          <View style={styles.selfVideoContainer}>
            {renderSelfVideo()}
          </View>

          {/* Botón para minimizar/maximizar */}
          {isControlsVisible && toggleMinimized && allowChat && (
            <TouchableOpacity style={styles.minimizeButton} onPress={toggleMinimized}>
              <Minimize2 size={24} color="#fff" />
            </TouchableOpacity>
          )}

          {/* Controles de llamada */}
          {isControlsVisible && (
            <View style={styles.controlsContainer}>
              <BlurView intensity={70} tint="dark" style={styles.controlsRow}>
                <HStack space="sm">
                  <TouchableOpacity
                    style={[styles.controlButton, isMuted && styles.activeButton]}
                    onPress={handleToggleMute}
                  >
                    {isMuted ? (
                      <MicOff size={24} color="#fff" />
                    ) : (
                      <Mic size={24} color="#fff" />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.controlButton, isVideoOff && styles.activeButton]}
                    onPress={handleToggleVideo}
                  >
                    {isVideoOff ? (
                      <VideoOff size={24} color="#fff" />
                    ) : (
                      <Video size={24} color="#fff" />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleFlipCamera}
                  >
                    <RotateCcw size={24} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.controlButton, isScreenSharing && styles.activeButton]}
                    onPress={handleScreenShare}
                  >
                    <Share2 size={24} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.controlButton, isGridView && styles.activeButton]}
                    onPress={() => setIsGridView(!isGridView)}
                  >
                    <Grid size={24} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.endCallButton}
                    onPress={onEndCall}
                  >
                    <PhoneOff size={24} color="#fff" />
                  </TouchableOpacity>
                </HStack>
              </BlurView>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default VideoCallUI;