import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { Banner } from '../types/banner';

interface BannerCardProps {
  banner: Banner;
}

const BannerCard: React.FC<BannerCardProps> = ({ banner }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: banner.acf.banner_image_url }} style={styles.image} />
    </View>
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
    height: 70,
    resizeMode: 'stretch',
    // height: 80,
    // resizeMode: 'contain',
  },
});

export default BannerCard;
