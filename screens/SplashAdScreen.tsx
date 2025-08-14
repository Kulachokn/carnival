import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Linking,
} from "react-native";
import { Banner } from "../types/banner";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import api from "../api/services";
import { RootStackParamList } from "../types/navigation";

function SplashAdScreen() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [countdown, setCountdown] = useState(3);

  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "SplashAd"
  >;

  const navigation = useNavigation<NavigationProp>();

//   useEffect(() => {
//     let timer: NodeJS.Timeout;

//     api.fetchBannersByType("start").then((banners) => {
//         console.log(banners[0]);
//       if (banners.length > 0) setBanner(banners[0]);
//     });

//     // Запускаємо таймер
//     timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//             navigation.replace("MainTabs");
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     // Cleanup function to clear interval on unmount
//     return () => clearInterval(timer);
//   }, []);

useEffect(() => {
  let isMounted = true;
  let timer: NodeJS.Timeout;

  api.fetchBannersByType("start").then((banners) => {
    if (isMounted && banners.length > 0) {
      setBanner(banners[0]);
    }
  });

  timer = setInterval(() => {
    setCountdown((prev) => {
      if (prev <= 1) {
        clearInterval(timer);

        setTimeout(() => navigation.replace("MainTabs"), 0);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => {
    isMounted = false;
    clearInterval(timer);
  };
}, []);


  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{countdown}</Text>
      </View>

      <TouchableOpacity
        style={styles.bannerWrapper}
        onPress={() => {
          if (banner?.acf.banner_url) {
            Linking.openURL(banner.acf.banner_url);
          }
        }}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: banner?.acf.banner_image_url }}
          style={styles.banner}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bannerWrapper: {
    flex: 1,
  },
  banner: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  timerContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  timerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SplashAdScreen;
