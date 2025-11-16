import { useState } from "react";
import { Box, Button, Typography, useMediaQuery, useTheme, Pagination } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { OrangeButton } from "./CustomButton";

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

const ITEMS_PER_PAGE = 4;

export const ListPage = ({ items = [], getDetailLink, search = "" }: ListPageProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(1);

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pagedItems = filteredItems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

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
        <Box
          sx={{ flex: 1, height: isMobile ? 300 : 500 }}
          role="region"
          aria-label="Mapa de ubicaciones de los items"
        >
          <MapContainer
            center={[42.88, -8.54]}
            zoom={8}
            style={{ width: "100%", height: "100%" }}
            aria-label="Mapa interactivo de los items"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredItems.map(item => (
              <Marker key={item.id} position={[item.lat, item.lng]} keyboard>
                <Popup>
                  <Typography
                    variant="subtitle2"
                    component="h3"
                    color={theme.palette.text.primary}
                  >
                    {item.label}
                  </Typography>
                  {item.description && (
                    <Typography variant="body2" sx={{ mt: 0.5 }} color={theme.palette.text.primary}>
                      {item.description}
                    </Typography>
                  )}
                  {getDetailLink && (
                    <Box sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        onClick={() => navigate(getDetailLink(item))}
                        aria-label={`Ver detalles de ${item.label}`}
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
        <Box sx={{ flex: 1, overflowY: "auto" }} role="list" aria-label="Lista de items">
          {pagedItems.map(item => (
            <Box
              key={item.id}
              role="listitem"
              sx={{
                p: 2,
                mb: 1,
                borderRadius: 1,
                backgroundColor: "background.paper",
              }}
            >
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                component="h2"
                color={theme.palette.text.primary}
              >
                {item.label}
              </Typography>
              {item.description && (
                <Typography variant="body2" sx={{ mt: 0.5 }} color={theme.palette.text.primary}>
                  {item.description}
                </Typography>
              )}
              {getDetailLink && (
                <OrangeButton
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => navigate(getDetailLink(item))}
                  aria-label={`Ver detalles de ${item.label}`}
                >
                  VER DETALLES
                </OrangeButton>
              )}
            </Box>
          ))}

          {/* Paginación */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
                backgroundColor: "background.paper",
                p: isMobile ? 0.5 : 1,
                borderRadius: 1,
              }}
              aria-label="Paginación de la lista de items"
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                size={isMobile ? "small" : "medium"}
                color="primary"
                showFirstButton
                showLastButton
                aria-label="Paginación"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
