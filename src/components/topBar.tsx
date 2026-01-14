import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';

interface TopBarProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
}

const TopBar: React.FC<TopBarProps> = ({
  title,
  onBackPress,
  showBackButton = true,
  rightComponent,
  backgroundColor = '#fff',
  textColor = '#212529',
}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.content}>
          {/* Left Section - Back Button */}
          <View style={styles.leftSection}>
            {showBackButton && onBackPress && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBackPress}
                activeOpacity={0.7}
              >
                <Text style={[styles.backIcon, { color: textColor }]}>←</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Center Section - Title */}
          <View style={styles.centerSection}>
            <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
              {title}
            </Text>
          </View>

          {/* Right Section - Optional Component */}
          <View style={styles.rightSection}>
            {rightComponent}
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
  },
  leftSection: {
    // width: 44,
    // flex: 1,
    justifyContent: 'center',
    bottom:10,
  },
  centerSection: {
    flex: 1,
    // alignItems: 'center',
    paddingHorizontal: 8,
  },
  rightSection: {
    // width: 44,
    flex: 1,
    alignItems: 'flex-end',
    // justifyContent: 'center',
  },
  backButton: {
    // width: 44,
    // height: 44,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  backIcon: {
    fontSize: 40,
    fontWeight: '600',
    justifyContent: 'center',
  },
  title: {
    fontSize:24,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

export default TopBar;