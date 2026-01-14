import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useCartStore } from '../store/cartStore';
import { CartItem } from '../types';

interface CartScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const items = useCartStore(state => state.items);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const getTotalPrice = useCartStore(state => state.getTotalPrice);
  const emptyCart = useCartStore(state => state.emptyCart);
  const totalQuantity = items.reduce((total, item) => total + item.quantity,
  0,)
  const handleRemoveItem = (petId: string, petName: string) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove ${petName} from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromCart(petId),
        },
      ],
    );
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

  const handleCheckout = (items: CartItem[]) => {
  
    Alert.alert(
      'Checkout',
      `Proceed to checkout with ${totalQuantity} item(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed',
          onPress: () => {
            Alert.alert('Success', 'Order placed successfully!');
            emptyCart();
          },
        },
      ],
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.image }}
        style={styles.cartItemImage}
        resizeMode="cover"
      />
      <View style={styles.cartItemContent}>
        <View style={styles.cartItemHeader}>
          <View style={styles.cartItemInfo}>
            <Text style={styles.cartItemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.cartItemBreed}>{item.breed}</Text>
            <Text style={styles.cartItemAge}>Age: {item.age} years</Text>
          </View>
          <TouchableOpacity
            style={styles.removeIconButton}
            onPress={() => handleRemoveItem(item.id, item.name)}
          >
            <Text style={styles.removeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cartItemFooter}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => {
                if (item.quantity === 1) {
                  handleRemoveItem(item.id, item.name);
                } else {
                  handleQuantityChange(item.id, item.quantity, -1);
                }
              }}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.id, item.quantity, 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.cartItemPrice}>
            ₹{(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
        </View>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <Text style={styles.emptySubtext}>
          Add some adorable pets to your cart
        </Text>
        <TouchableOpacity
          style={styles.continueShopping}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.continueShoppingText}>Browse Pets</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.headerSubtitle}>{totalQuantity} item(s)</Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottomContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>₹{getTotalPrice().toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={{paddingHorizontal:20}}>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={()=>handleCheckout(items)}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cartItemImage: {
    width: 100,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#e9ecef',
  },
  cartItemContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cartItemInfo: {
    flex: 1,
    marginRight: 8,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  cartItemBreed: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 2,
  },
  cartItemAge: {
    fontSize: 13,
    color: '#adb5bd',
  },
  removeIconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 16,
    color: '#dc3545',
    fontWeight: 'bold',
  },
  cartItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  cartItemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
  },
  bottomContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#6c757d',
  },
  summaryValue: {
    fontSize: 15,
    color: '#495057',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingVertical: 10,
    paddingHorizontal: 20,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  totalPrice: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#28a745',
  },
  checkoutButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 12,
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
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 60,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#adb5bd',
    marginBottom: 32,
    textAlign: 'center',
  },
  continueShopping: {
    backgroundColor: '#28a745',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  continueShoppingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;
