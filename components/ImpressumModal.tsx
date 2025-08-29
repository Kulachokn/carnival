import React from "react";
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import EvilIcons from "@expo/vector-icons/EvilIcons";

interface ImpressumModalProps {
  visible: boolean;
  onClose: () => void;
}

const ImpressumModal = ({ visible, onClose }: ImpressumModalProps) => {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <EvilIcons name="close" size={30} color="black" />
        </TouchableOpacity>
        <WebView source={require("../assets/impressum.html")} style={{ flex: 1 }} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  closeBtn: { alignSelf: "flex-end", paddingTop: 40, paddingRight: 16 },
});

export default ImpressumModal;
