import { Box, useTheme } from "@mui/material";

interface Column {
  key: string;
  label: string;
  render?: (item: any) => React.ReactNode; // Permite renderizado personalizado
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  loading: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onCreate?: () => void;
  createLabel?: string;
}

export const AdminTable: React.FC<AdminTableProps> = ({
  columns,
  data,
  loading,
  loadingMessage = "Cargando...",
  emptyMessage = "No hay elementos disponibles",
  onEdit,
  onDelete,
  onCreate,
  createLabel = "Crear nuevo",
}) => {
  const theme = useTheme();

  if (loading) return <p>{loadingMessage}</p>;
  if (!data.length) return <p>{emptyMessage}</p>;

  return (
    <Box sx={{ px: 4, mt: 2, mb: 2 }}>
      {onCreate && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={onCreate}
          >
            {createLabel}
          </button>
        </Box>
      )}

      <Box
        component="table"
        sx={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          color: theme.palette.primary.main,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          component="thead"
          sx={{
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.common.white,
          }}
        >
          <Box component="tr">
            {columns.map((col) => (
              <Box component="th" key={col.key} sx={{ p: 2, textAlign: "left" }}>
                {col.label}
              </Box>
            ))}
            {(onEdit || onDelete) && (
              <Box component="th" sx={{ p: 2, textAlign: "left" }}>
                Acciones
              </Box>
            )}
          </Box>
        </Box>

        <Box component="tbody">
          {data.map((item, rowIndex) => {
            // Usar un key único por fila: id si existe, sino fallback al índice
            const rowKey = item.id ?? item.usuarioId ?? item.clubId ?? item.comentarioId ?? rowIndex;
            return (
              <Box component="tr" key={rowKey} sx={{ borderBottom: "1px solid #ccc" }}>
                {columns.map((col, colIndex) => (
                  <Box
                    component="td"
                    sx={{ p: 2 }}
                    key={col.key + "-" + colIndex} // clave única por columna
                  >
                    {col.render ? col.render(item) : item[col.key]}
                  </Box>
                ))}
                {(onEdit || onDelete) && (
                  <Box component="td" sx={{ p: 2, display: "flex", gap: 1 }}>
                    {onEdit && (
                      <button
                        style={{
                          padding: "4px 8px",
                          backgroundColor: theme.palette.success.main,
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                        onClick={() => onEdit(item)}
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        style={{
                          padding: "4px 8px",
                          backgroundColor: theme.palette.error.main,
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                        onClick={() => onDelete(item)}
                      >
                        Eliminar
                      </button>
                    )}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
