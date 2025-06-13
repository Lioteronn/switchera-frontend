import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ScreenShareProps {
  selectedContact: {
    id: string;
    name: string;
    avatar?: string;
  } | null;
  onEndCall: () => void;
  isIncoming?: boolean;
  callType: 'video' | 'audio' | 'screenshare';
}

export default function ScreenShare({ 
  selectedContact, 
  onEndCall, 
  isIncoming = false,
  callType 
}: ScreenShareProps) {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [participants, setParticipants] = useState(1);
  const [callDuration, setCallDuration] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [webStream, setWebStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  
  const localVideoRef = useRef<any>(null);
  const remoteVideoRef = useRef<any>(null);
  const screenShareRef = useRef<any>(null);
  const controlsTimer = useRef<NodeJS.Timeout | null>(null);

  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;
  const isMobile = Platform.OS !== 'web' || width < 768;

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
    
    // Start call timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Resetea el timer y streams cuando el componente se desmonta
    return () => {
      clearInterval(timer);
      
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
    if (Platform.OS === 'web' && localVideoRef.current && webStream) {
      localVideoRef.current.srcObject = webStream;
    }
  }, [webStream]);
  
  // Efecto para conectar el stream de compartición de pantalla al elemento de video
  useEffect(() => {
    if (Platform.OS === 'web' && screenShareRef.current && screenStream) {
      screenShareRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  const startScreenShare = async () => {
    if (Platform.OS === 'web') {
      try {
        const screenStreamData = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });

        setScreenStream(screenStreamData);
        setIsScreenSharing(true);

        // Handle screen share end
        screenStreamData.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setScreenStream(null);
        };
      } catch (error) {
        console.error('Error starting screen share:', error);
      }
    } else {
      // Mobile screen share simulation
      setIsScreenSharing(true);
    }
  };

  const stopScreenShare = () => {
    if (Platform.OS === 'web' && screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
    setIsScreenSharing(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (Platform.OS === 'web' && webStream) {
      const audioTracks = webStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
    }
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    if (Platform.OS === 'web' && webStream) {
      const videoTracks = webStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = isCameraOn;
      });
    }
  };

  const toggleFullscreen = () => {
    if (Platform.OS === 'web') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Renderizado para web con funcionalidad real
  const renderWebVideo = () => (
    <View style={styles.mainVideoContainer}>
      {isScreenSharing && screenStream ? (
        <video
          ref={screenShareRef}
          style={styles.screenShareVideo}
          autoPlay
          playsInline
        />
      ) : (
        <View style={styles.remoteVideo}>
          <Text style={styles.placeholderText}>
            Vídeo de {selectedContact?.name}
          </Text>
        </View>
      )}
      
      {/* Local video (picture-in-picture) */}
      {isCameraOn && (
        <View style={[
          styles.localVideoContainer,
          isMobile && styles.localVideoMobile
        ]}>
          <video
            ref={localVideoRef}
            style={styles.localVideo}
            autoPlay
            playsInline
            muted
          />
        </View>
      )}
    </View>
  );

  // Renderizado para móvil con Expo Camera
  const renderMobileVideo = () => (
    <View style={styles.mainVideoContainer}>
      {/* Simulación de video remoto */}
      <View style={styles.remoteVideo}>
        <Text style={styles.placeholderText}>
          {isScreenSharing ? 'Screen Share' : `${selectedContact?.name}'s Video`}
        </Text>
      </View>
      
      {/* Cámara local con Expo Camera */}
      {isCameraOn && hasPermission && (
        <View style={[styles.localVideoContainer, styles.localVideoMobile]}>
          <CameraView
            style={styles.localVideo}
            facing='front'
          />
        </View>
      )}
      
      {/* Mostrar si no hay permisos */}
      {!hasPermission && (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Se requieren permisos de cámara para realizar videollamadas
          </Text>
        </View>
      )}
    </View>
  );

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Solicitando permisos...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isFullscreen && styles.fullscreen]}>
      {/* Header */}
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <View style={styles.callInfo}>
          <Text style={styles.contactName}>{selectedContact?.name}</Text>
          <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
          <Text style={styles.participantCount}>{participants} participant{participants > 1 ? 's' : ''}</Text>
        </View>
        
        {!isMobile && Platform.OS === 'web' && (
          <TouchableOpacity style={styles.fullscreenButton} onPress={toggleFullscreen}>
            <Ionicons 
              name={isFullscreen ? "contract" : "expand"} 
              size={20} 
              color="#fff" 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Video Area */}
      {Platform.OS === 'web' ? renderWebVideo() : renderMobileVideo()}

      {/* Controls */}
      <View style={[styles.controls, isMobile && styles.controlsMobile]}>
        <View style={styles.controlsRow}>
          {/* Mute button */}
          <TouchableOpacity 
            style={[styles.controlButton, isMuted && styles.controlButtonActive]}
            onPress={toggleMute}
          >
            <Ionicons 
              name={isMuted ? "mic-off" : "mic"} 
              size={24} 
              color={isMuted ? "#fff" : "#323130"} 
            />
          </TouchableOpacity>

          {/* Camera button */}
          <TouchableOpacity 
            style={[styles.controlButton, !isCameraOn && styles.controlButtonActive]}
            onPress={toggleCamera}
          >
            <Ionicons 
              name={isCameraOn ? "videocam" : "videocam-off"} 
              size={24} 
              color={!isCameraOn ? "#fff" : "#323130"} 
            />
          </TouchableOpacity>

          {/* Screen share button - solo en web */}
          {Platform.OS === 'web' && (
            <TouchableOpacity 
              style={[styles.controlButton, isScreenSharing && styles.controlButtonActive]}
              onPress={isScreenSharing ? stopScreenShare : startScreenShare}
            >
              <Ionicons 
                name="desktop" 
                size={24} 
                color={isScreenSharing ? "#fff" : "#323130"} 
              />
            </TouchableOpacity>
          )}

          {/* Settings button */}
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="settings" size={24} color="#323130" />
          </TouchableOpacity>

          {/* End call button */}
          <TouchableOpacity 
            style={styles.endCallButton}
            onPress={onEndCall}
          >
            <Ionicons name="call" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Screen share indicator */}
      {isScreenSharing && (
        <View style={styles.screenShareIndicator}>
          <Ionicons name="desktop" size={16} color="#fff" />
          <Text style={styles.screenShareText}>Estás compartiendo tu pantalla</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ...existing styles...
  loadingText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  permissionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 12,
    borderRadius: 8,
  },
  permissionText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  // ...rest of existing styles...
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  fullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerMobile: {
    padding: 12,
  },
  callInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  callDuration: {
    fontSize: 14,
    color: '#d1d1d1',
    marginBottom: 2,
  },
  participantCount: {
    fontSize: 12,
    color: '#a1a1a1',
  },
  fullscreenButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  mainVideoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenShareVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  localVideoContainer: {
    position: 'absolute',
    top: 80,
    right: 16,
    width: 200,
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#6264a7',
    backgroundColor: '#2a2a2a',
  },
  localVideoMobile: {
    width: 120,
    height: 90,
    top: 60,
    right: 12,
  },
  localVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderText: {
    color: '#a1a1a1',
    fontSize: 14,
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
  },
  controlsMobile: {
    padding: 16,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#d13438',
  },
  endCallButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#d13438',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  screenShareIndicator: {
    position: 'absolute',
    top: 100,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(98, 100, 167, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  screenShareText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
  },
});