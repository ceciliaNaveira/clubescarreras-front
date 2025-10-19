import { Box, Typography, Button } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../leaflet.css';
import { useNavigate } from 'react-router-dom';

interface ItemData {
  id: string;
  lat: number;
  lng: number;
  label: string;
  description?: string;
}

interface ListPageProps {
  title: string;
  description: string;
  items?: ItemData[];
  getDetailLink?: (item: ItemData) => string;
  search?: string; // search externo
}

export const ListPage = ({ title, description, items = [], getDetailLink, search = "" }: ListPageProps) => {
  const navigate = useNavigate();

  // Filtrado por search recibido desde el padre
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", gap: 2, mt: 2, height: "500px" }}>
        {/* Mapa */}
        <Box sx={{ flex: 1 }}>
          <MapContainer center={[42.88, -8.54]} zoom={8} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredItems.map(item => (
              <Marker key={item.id} position={[item.lat, item.lng]}>
                <Popup>
                  {item.label}
                  {getDetailLink && (
                    <Box sx={{ mt: 1 }}>
                      <Button size="small" onClick={() => navigate(getDetailLink(item))}>
                        Ver detalles
                      </Button>
                    </Box>
                  )}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>

        {/* Lista */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {filteredItems.map(item => (
            <Box key={item.id} sx={{ p: 2, mb: 1, borderRadius: 1, backgroundColor: "background.paper" }}>
              <Typography variant="h6">{item.label}</Typography>
              {item.description && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {item.description}
                </Typography>
              )}
              {getDetailLink && (
                <Button size="small" sx={{ mt: 1 }} onClick={() => navigate(getDetailLink(item))}>
                  Ver detalles
                </Button>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
