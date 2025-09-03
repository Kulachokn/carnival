import React from "react";
import { Platform } from "react-native";
import { UrlTile } from "react-native-maps";

// Map styles/providers you can use
const TILE_SERVERS = {
  OSM_STANDARD: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", // Standard OpenStreetMap
  OSM_HUMANITARIAN: "https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", // Humanitarian style
  STAMEN_TERRAIN: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg", // Terrain style
  STAMEN_TONER: "https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png", // High contrast B&W
  CYCLEMAP: "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png", // Cycle map
};

interface Props {
  tileType?: keyof typeof TILE_SERVERS;
}

export const OpenStreetMapTiles: React.FC<Props> = ({ 
  tileType = "OSM_STANDARD"
}) => {
  const urlTemplate = TILE_SERVERS[tileType];
  
  // Add attribution note on the console for legal requirements
  React.useEffect(() => {
    console.log(
      "Map tiles provided by OpenStreetMap © OpenStreetMap contributors"
    );
  }, []);
  
  return (
    <UrlTile
      urlTemplate={urlTemplate}
      maximumZ={19}
      flipY={false}
      zIndex={-1}
    />
  );
};
