import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors } from '../../constants/colors';

interface HolographicViewfinderProps {
  imageUri?: string | null;
  onImageSelected?: (uri: string) => void;
}

export const HolographicViewfinder: React.FC<HolographicViewfinderProps> = ({
  imageUri,
  onImageSelected,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // Laser sweep animation loop
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const nd = Platform.OS !== 'web';
    const sweep = Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 2800,
          useNativeDriver: nd,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 2800,
          useNativeDriver: nd,
        }),
      ])
    );
    sweep.start();
    return () => sweep.stop();
  }, [laserAnim]);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageSelected?.(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Image picker cancelled or failed:', err);
    }
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
        if (photo && photo.uri) {
          onImageSelected?.(photo.uri);
        }
      } catch (e) {
        console.warn('Failed to take picture:', e);
      }
    }
  };

  const laserTranslateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 260],
  });

  return (
    <View style={styles.container}>
      {/* Background Simulated Bill Document OR Real Camera */}
      <View style={styles.imageWrapper}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.billImage}
            resizeMode="cover"
          />
        ) : (
          permission?.granted ? (
            <CameraView
              ref={cameraRef}
              style={styles.billImage}
              facing="back"
              autofocus="on"
            />
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Text style={styles.placeholderText}>Waiting for Camera Permission...</Text>
              {!permission && (
                <TouchableOpacity onPress={requestPermission} style={styles.permButton}>
                  <Text style={styles.permText}>Grant Permission</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        )}
        <View style={styles.darkGradientOverlay} />
      </View>

      {/* Sweeping Laser Scan Blade */}
      <Animated.View
        style={[
          styles.laserBlade,
          { transform: [{ translateY: laserTranslateY }] },
        ]}
      >
        <View style={styles.laserGlowGradient} />
        <View style={styles.laserLine} />
      </Animated.View>

      {/* Dynamic Optical Corner Brackets */}
      <View style={styles.bracketTopLeft}>
        <View style={styles.bracketHorizontal} />
        <View style={styles.bracketVertical} />
      </View>
      <View style={styles.bracketTopRight}>
        <View style={styles.bracketHorizontal} />
        <View style={styles.bracketVertical} />
      </View>
      <View style={styles.bracketBottomLeft}>
        <View style={styles.bracketVertical} />
        <View style={styles.bracketHorizontal} />
      </View>
      <View style={styles.bracketBottomRight}>
        <View style={styles.bracketVertical} />
        <View style={styles.bracketHorizontal} />
      </View>

      {/* Center Reticle & Classifier Banner */}
      <View style={styles.centerReticle}>
        <View style={styles.classifierPill}>
          <View style={styles.liveGreenDot} />
          <Text style={styles.classifierText}>DISCO: LESCO URBAN (3-PHASE)</Text>
        </View>
        <Text style={styles.reticleInstruction}>
          ALIGN TARIFF SECTION WITHIN RECTANGLE
        </Text>
      </View>

      {/* Biometric Floating Lock Badges */}
      <View style={styles.badgeTopLeft}>
        <MaterialCommunityIcons name="check-circle" size={14} color={colors.primaryBright} />
        <Text style={styles.badgeText}>BARCODE: VERIFIED</Text>
      </View>

      <View style={styles.badgeBottomRight}>
        <MaterialCommunityIcons name="alert-circle" size={14} color={colors.secondaryContainer} />
        <Text style={[styles.badgeText, { color: colors.secondaryContainer }]}>
          SLAB TIER THRESHOLD ALERT
        </Text>
      </View>

      {/* Capture Button */}
      {!imageUri && permission?.granted && (
        <TouchableOpacity style={styles.captureBtn} onPress={handleCapture} activeOpacity={0.8}>
          <MaterialCommunityIcons name="camera-iris" size={32} color={colors.textPrimary} />
        </TouchableOpacity>
      )}

      {/* Pick/Change Image Floating Button */}
      <TouchableOpacity
        style={styles.changePhotoBtn}
        onPress={handlePickImage}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="image-plus" size={16} color={colors.textPrimary} />
        <Text style={styles.changePhotoText}>{imageUri ? 'Upload Different Bill' : 'Upload Bill'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerLowest,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  imageWrapper: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
  },
  billImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  cameraPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.textSecondary,
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  permButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primaryBright,
    borderRadius: 8,
  },
  permText: {
    color: '#000',
    fontWeight: 'bold',
  },
  darkGradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 13, 20, 0.45)',
  },
  laserBlade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 70,
    zIndex: 10,
    pointerEvents: 'none',
  },
  laserGlowGradient: {
    flex: 1,
    backgroundColor: 'rgba(0, 229, 153, 0.18)',
  },
  laserLine: {
    height: 2.5,
    backgroundColor: colors.primaryBright,
    shadowColor: colors.primaryBright,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  bracketTopLeft: {
    position: 'absolute',
    top: 18,
    left: 18,
    width: 28,
    height: 28,
  },
  bracketTopRight: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 28,
    height: 28,
    alignItems: 'flex-end',
  },
  bracketBottomLeft: {
    position: 'absolute',
    bottom: 18,
    left: 18,
    width: 28,
    height: 28,
  },
  bracketBottomRight: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    width: 28,
    height: 28,
    alignItems: 'flex-end',
  },
  bracketHorizontal: {
    width: 26,
    height: 3,
    backgroundColor: colors.primaryBright,
    borderRadius: 2,
    shadowColor: colors.primaryBright,
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  bracketVertical: {
    width: 3,
    height: 26,
    backgroundColor: colors.primaryBright,
    borderRadius: 2,
    shadowColor: colors.primaryBright,
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  centerReticle: {
    position: 'absolute',
    top: '46%',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 6,
    zIndex: 15,
  },
  classifierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(10, 14, 22, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.3)',
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryBright,
  },
  classifierText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryBright,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  reticleInstruction: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.tertiaryContainer,
    letterSpacing: 1.2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    opacity: 0.85,
  },
  badgeTopLeft: {
    position: 'absolute',
    top: '24%',
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(10, 14, 22, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  badgeBottomRight: {
    position: 'absolute',
    bottom: '28%',
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(10, 14, 22, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(254, 183, 0, 0.3)',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  changePhotoBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(18, 26, 38, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    zIndex: 20,
  },
  changePhotoText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  captureBtn: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 229, 153, 0.2)',
    borderWidth: 2,
    borderColor: colors.primaryBright,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
});
