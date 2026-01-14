import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  Animated,
  Platform,
  PermissionsAndroid,
  Linking,
  SafeAreaView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
// import { submitPetDetails, fetchRandomPetImage } from '../services/api';
import { usePetStore } from '../store/petStore';
import { PetFormData } from '../types';
import TopBar from '../components/topBar';

const schema = yup.object().shape({
  name: yup.string().required('Pet name is required'),
  breed: yup.string().required('Breed is required'),
  age: yup.string().required('Age is required'),
  price: yup.string().required('Price is required'),
});

interface PetUploadScreenProps {
  navigation: any;
}

const PetUploadScreen: React.FC<PetUploadScreenProps> = ({ navigation }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingRandomImage, setFetchingRandomImage] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const scaleAnim = useState(new Animated.Value(0))[0];
  const addPet = usePetStore((state) => state.addPet);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PetFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      breed: '',
      age: '',
      price: '',
      // image: null,
    },
  });

  const requestCameraPermission = async () => {
    if (Platform.OS === 'ios') {
      // iOS permissions are handled automatically by react-native-image-picker
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos of pets.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera permission in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
      return false;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const pickImage = async (source: 'camera' | 'gallery') => {
    setShowImageOptions(false);
    
    // Request camera permission for camera source on Android
    if (source === 'camera' && Platform.OS === 'android') {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        return;
      }
    }
    
    const options = {
      mediaType: 'photo' as const,
      quality: 1,
      includeBase64: false,
      saveToPhotos: source === 'camera',
    };

    const callback = (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      }
      if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorCode, response.errorMessage);
        
        if (response.errorCode === 'camera_unavailable') {
          Alert.alert('Error', 'Camera is not available on this device');
        } else if (response.errorCode === 'permission') {
          Alert.alert(
            'Permission Required',
            'Please enable camera permission in settings',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
        } else {
          Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        }
        return;
      }
      if (response.assets && response.assets[0]) {
        const uri = response.assets[0].uri;
        if (uri) {
          setImageUri(uri);
        }
      }
    };

    try {
      if (source === 'camera') {
        launchCamera(options, callback);
      } else {
        launchImageLibrary(options, callback);
      }
    } catch (error) {
      console.error('Launch error:', error);
      Alert.alert('Error', 'Failed to open ' + (source === 'camera' ? 'camera' : 'gallery'));
    }
  };

  const handleFetchRandomImage = async () => {
    setShowImageOptions(false);
    setFetchingRandomImage(true);
    
    try {
      // Commented out API call - using placeholder instead
      // const imageUrl = await fetchRandomPetImage();
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Using placeholder images from Unsplash
      const placeholderImages = [
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800',
        'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800',
      ];
      const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      setImageUri(randomImage);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to fetch random image');
    } finally {
      setFetchingRandomImage(false);
    }
  };

  const showSuccessAnimation = () => {
    setShowSuccessModal(true);
    
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const closeSuccessModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowSuccessModal(false);
      reset();
      setImageUri(null);
      navigation.goBack();
    });
  };

  const onSubmit = async (data: PetFormData) => {
    if (!imageUri) {
      Alert.alert('Image Required', 'Please select or fetch an image before submitting');
      return;
    }

    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const formData: PetFormData = {
        ...data,
        image: imageUri,
      };
      console.log("formData", formData);

      // Commented out API call - using only global state
      // await submitPetDetails(formData);

      // Add pet to store
      const pet = {
        id: Date.now().toString(),
        name: data.name,
        breed: data.breed,
        age: parseFloat(data.age),
        price: parseFloat(data.price),
        image: imageUri,
      };

      addPet(pet);
      showSuccessAnimation();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to submit pet details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <TopBar
        title="Add New Pet"
        onBackPress={() => navigation.goBack()}
        showBackButton={true}
      />
      
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Preview Section */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Pet Photo</Text>
          
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image 
                source={{ uri: imageUri }} 
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => setImageUri(null)}
              >
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.imagePlaceholder}
              onPress={() => setShowImageOptions(true)}
            >
              <Text style={styles.imagePlaceholderIcon}>📷</Text>
              <Text style={styles.imagePlaceholderText}>Tap to add photo</Text>
            </TouchableOpacity>
          )}

          {!imageUri && (
            <TouchableOpacity
              style={styles.selectImageButton}
              onPress={() => setShowImageOptions(true)}
            >
              <Text style={styles.selectImageButtonText}>Choose Image</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Pet Information</Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Pet Name *</Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="e.g., Max, Bella"
                  placeholderTextColor="#adb5bd"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="breed"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Breed *</Text>
                <TextInput
                  style={[styles.input, errors.breed && styles.inputError]}
                  placeholder="e.g., Golden Retriever, Persian"
                  placeholderTextColor="#adb5bd"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
                {errors.breed && <Text style={styles.errorText}>{errors.breed.message}</Text>}
              </View>
            )}
          />

          <View style={styles.row}>
            <Controller
              control={control}
              name="age"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Age (years) *</Text>
                  <TextInput
                    style={[styles.input, errors.age && styles.inputError]}
                    placeholder="e.g., 2"
                    placeholderTextColor="#adb5bd"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                  />
                  {errors.age && <Text style={styles.errorText}>{errors.age.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Price ($) *</Text>
                  <TextInput
                    style={[styles.input, errors.price && styles.inputError]}
                    placeholder="e.g., 500"
                    placeholderTextColor="#adb5bd"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                  />
                  {errors.price && <Text style={styles.errorText}>{errors.price.message}</Text>}
                </View>
              )}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.submitButtonIcon}>✓</Text>
                <Text style={styles.submitButtonText}>Submit Pet</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Options Modal */}
      <Modal
        visible={showImageOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.optionsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Image Source</Text>
              <TouchableOpacity onPress={() => setShowImageOptions(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => pickImage('camera')}
            >
              <Text style={styles.optionIcon}>📷</Text>
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => pickImage('gallery')}
            >
              <Text style={styles.optionIcon}>🖼️</Text>
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleFetchRandomImage}
              disabled={fetchingRandomImage}
            >
              {fetchingRandomImage ? (
                <ActivityIndicator size="small" color="#007bff" />
              ) : (
                <>
                  <Text style={styles.optionIcon}>🎲</Text>
                  <Text style={styles.optionText}>Get Random Image</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowImageOptions(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="none"
      >
        <View style={styles.successOverlay}>
          <Animated.View 
            style={[
              styles.successModal,
              {
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <View style={styles.successIconContainer}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Pet Added Successfully!</Text>
            <Text style={styles.successMessage}>Your pet has been added to the shop</Text>
            
            <TouchableOpacity
              style={styles.successButton}
              onPress={closeSuccessModal}
              activeOpacity={0.8}
            >
              <Text style={styles.successButtonText}>Done</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Full Screen Loader */}
      {(loading || fetchingRandomImage) && (
        <View style={styles.loaderOverlay}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#28a745" />
            <Text style={styles.loaderText}>
              {fetchingRandomImage ? 'Fetching image...' : 'Submitting...'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 15,
    color: '#6c757d',
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  imageSection: {
    marginBottom: 32,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: 240,
    backgroundColor: '#e9ecef',
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  imagePlaceholder: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
  },
  imagePlaceholderIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  imagePlaceholderText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '500',
  },
  selectImageButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectImageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formSection: {
    marginBottom: 0,
  },
  inputContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#212529',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#dee2e6',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#212529',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 13,
    marginTop: 6,
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#28a745',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#81C784',
    opacity: 0.7,
  },
  submitButtonIcon: {
    fontSize: 20,
    color: '#fff',
    marginRight: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  optionsModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  modalClose: {
    fontSize: 24,
    color: '#6c757d',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  optionText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#212529',
  },
  cancelButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModal: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 44,
    color: '#fff',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 28,
    textAlign: 'center',
  },
  successButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  successButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loaderContainer: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 160,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#495057',
    fontWeight: '600',
  },
});

export default PetUploadScreen;