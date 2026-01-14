import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { usePetStore } from '../store/petStore';
import { useCartStore } from '../store/cartStore';
import { Pet } from '../types';

interface PetListingScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

const PetListingScreen: React.FC<PetListingScreenProps> = ({ navigation }) => {
  const pets = usePetStore(state => state.pets);
  const addToCart = useCartStore(state => state.addToCart);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const items = useCartStore(state => state.items);
  const [refreshing, setRefreshing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addedPetName, setAddedPetName] = useState('');
  const scaleAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    console.log('Current pets in store:', pets);
  }, [pets]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('PetUpload')}
        >
          <Text style={styles.headerButtonText}>+ Add Pet</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const showSuccessAnimation = (petName: string) => {
    setAddedPetName(petName);
    setShowSuccessModal(true);

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowSuccessModal(false);
    });
  };

  const handleAddToCart = (pet: Pet) => {
    addToCart(pet);
    console.log('Adding to cart:', items);
    showSuccessAnimation(pet.name);
  };

  const handleGoToCart = () => {
    closeModal();
    setTimeout(() => navigation.navigate('Cart'), 250);
  };

  const handleQuantityChange = (
    petId: string,
    currentQty: number,
    change: number,
  ) => {
    const newQty = currentQty + change;
    if (newQty > 0) {
      updateQuantity(petId, newQty);
    }
  };

  const renderPetCard = ({ item, index }: { item: Pet; index: number }) => {
    const isItemExsisting = items.find(i => i.id === item.id) ;
    console.log("isItemExsisting",isItemExsisting);
    
    return (
      <Animated.View
        style={[
          styles.card,
          {
            opacity: 1,
            transform: [{ scale: 1 }],
          },
        ]}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.priceTag}>
            <Text style={styles.priceTagText}>${item.price.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.cardBreed}>{item.breed}</Text>
            </View>
            <View style={styles.ageContainer}>
              <Text style={styles.ageLabel}>Age</Text>
              <Text style={styles.ageValue}>{item.age}y</Text>
            </View>
          </View>

          {!isItemExsisting ? (
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => handleAddToCart(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.addToCartIcon}>🛒</Text>
              <Text style={styles.addToCartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          ) : (
            // <TouchableOpacity
            //   style={styles.addToCartButton}
            //   onPress={() => handleAddToCart(item)}
            //   activeOpacity={0.8}
            // >
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={[styles.quantityButton, {} ]}
                  onPress={() =>
                    handleQuantityChange(isItemExsisting.id , isItemExsisting?.quantity, -1)
                  }
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.quantityText, {alignItems:'center'}]}>{isItemExsisting.quantity}</Text>
                <TouchableOpacity
                  style={[styles.quantityButton, {alignSelf:'flex-end'}]}
                  onPress={() =>
                    handleQuantityChange(isItemExsisting.id, isItemExsisting.quantity, 1)
                  }
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            // </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  if (pets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Text style={styles.emptyIcon}>🐾</Text>
        </View>
        <Text style={styles.emptyText}>No Pets Available</Text>
        <Text style={styles.emptySubtext}>
          Start by adding your first adorable pet!
        </Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => navigation.navigate('PetUpload')}
          activeOpacity={0.8}
        >
          <Text style={styles.emptyButtonIcon}>+</Text>
          <Text style={styles.emptyButtonText}>Add Your First Pet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        renderItem={renderPetCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#28a745']}
            tintColor="#28a745"
          />
        }
      />

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.successModal,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.successIconContainer}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Added to Cart!</Text>
            <Text style={styles.successMessage}>{addedPetName}</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={closeModal}
                activeOpacity={0.8}
              >
                <Text style={styles.continueButtonText}>Continue Shopping</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.viewCartButton}
                onPress={handleGoToCart}
                activeOpacity={0.8}
              >
                <Text style={styles.viewCartButtonText}>View Cart</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  imageContainer: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#e9ecef',
  },
  priceTag: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  priceTagText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  cardName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  cardBreed: {
    fontSize: 15,
    color: '#6c757d',
    marginTop: 2,
  },
  ageContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  ageLabel: {
    fontSize: 11,
    color: '#6c757d',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 2,
  },
  ageValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  addToCartButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#007bff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addToCartIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  emptyIcon: {
    fontSize: 70,
  },
  emptyText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#adb5bd',
    marginBottom: 36,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#28a745',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyButtonIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  headerButton: {
    marginRight: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#28a745',
    borderRadius: 8,
  },
  headerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
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
  modalButtons: {
    width: '100%',
    gap: 12,
  },
  continueButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  continueButtonText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '600',
  },
  viewCartButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6c757d',
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    justifyContent:'space-between',
    // padding:10
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
});

export default PetListingScreen;
