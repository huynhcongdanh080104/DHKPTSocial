import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useState, useEffect } from "react";

// Component để cập nhật vị trí bản đồ khi tọa độ thay đổi
const MapUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 15); // Cập nhật trung tâm bản đồ
  }, [position, map]);
  return null;
};

const LeafletMap = ({ lat, lon }) => {
  const [position, setPosition] = useState([10.762622, 106.660172]); // Mặc định Hồ Chí Minh

  

  useEffect(() => {
    if(lat === 0 || lon === 0) return;
    setPosition([parseFloat(lat), parseFloat(lon)]);
    // const geocodeAddress = async () => {
    //   const response = await fetch(
    //     `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    //   );
    //   const data = await response.json();

    //   if (data.length > 0) {
    //     const { lat, lon } = data[0];
    //     setPosition([parseFloat(lat), parseFloat(lon)]);
    //   } else {
    //     console.error("Không tìm thấy địa chỉ");
    //   }
    // };
    // geocodeAddress();
  }, [lat && lon]);

  return (
    <MapContainer center={position} zoom={15} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>{"Vị trí của bạn"}</Popup>
      </Marker>
      <MapUpdater position={position} />
    </MapContainer>
  );
};

export default LeafletMap;
