import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

interface ItemData {
  id: string;
  lat: number;
  lng: number;
  label: string;
  description?: string;
}

interface ListPageProps {
  items?: ItemData[];
  getDetailLink?: (item: ItemData) => string;
  search?: string;
}

export const ListPage = ({ items = [], getDetailLink, search = "" }: ListPageProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Contenedor mapa + lista */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
        }}
      >
        {/* Mapa */}
        <Box sx={{ flex: 1, height: isMobile ? 300 : 500 }}>
          <MapContainer
            center={[42.88, -8.54]}
            zoom={8}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredItems.map(item => (
              <Marker key={item.id} position={[item.lat, item.lng]}>
                <Popup>
                  <Typography variant="subtitle2">{item.label}</Typography>
                  {item.description && (
                    <Typography variant="body2">{item.description}</Typography>
                  )}
                  {getDetailLink && (
                    <Box sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        onClick={() => navigate(getDetailLink(item))}
                      >
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
            <Box
              key={item.id}
              sx={{ p: 2, mb: 1, borderRadius: 1, backgroundColor: "background.paper" }}
            >
              <Typography variant="h6">{item.label}</Typography>
              {item.description && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {item.description}
                </Typography>
              )}
              {getDetailLink && (
                <Button
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => navigate(getDetailLink(item))}
                >
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
