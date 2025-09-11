import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';

import { Banner } from '../types/banner';

interface BannerCardProps {
  banner: Banner;
}

const BannerCard: React.FC<BannerCardProps> = ({ banner }) => {
  const handleBannerPress = () => {
    if (banner.acf.banner_url) {
      Linking.openURL(banner.acf.banner_url);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handleBannerPress}
      disabled={!banner.acf.banner_url}
      activeOpacity={0.8}
    >
      <Image source={{ uri: banner.acf.banner_image_url }} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 80,
    resizeMode: 'stretch',
  },
});

export default BannerCard;
