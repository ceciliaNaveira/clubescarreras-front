import { Box, useTheme, TextField } from "@mui/material";
import { useState, useMemo } from "react";

interface Column<T = any> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode; 
}

interface AdminTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onCreate?: () => void;
  createLabel?: string;
  searchKeys?: (keyof T | string)[];
}

export const AdminTable = <T extends any>({
  columns,
  data,
  loading,
  loadingMessage = "Cargando...",
  emptyMessage = "No hay elementos disponibles",
  onEdit,
  onDelete,
  onCreate,
  createLabel = "Crear nuevo",
  searchKeys,
}: AdminTableProps<T>) => {
  const theme = useTheme();
  const [search, setSearch] = useState("");

  // Filtrado para búsqueda
  const filteredData = useMemo(() => {
    if (!search) return data;
    const keysToSearch = searchKeys && searchKeys.length > 0 ? searchKeys : [columns[0].key];

    return data.filter((item) =>
      keysToSearch.some((key) => {
        const value = (item as any)[key];
        return value !== undefined && value !== null && value.toString().toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [data, search, columns, searchKeys]);

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "16px" }}>
        {loadingMessage}
      </p>
    );

  return (
    <Box sx={{ px: 4, mt: 2, mb: 2 }}>
      {/* Barra de búsqueda y botón crear */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& .MuiInputBase-input": { color: theme.palette.text.secondary },
            },
          }}
        />
        {onCreate && (
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
        )}
      </Box>

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
        {/* Cabecera */}
        <Box component="thead" sx={{ backgroundColor: theme.palette.primary.light, color: theme.palette.common.white }}>
          <Box component="tr">
            {columns.map((col) => (
              <Box component="th" key={col.key.toString()} sx={{ p: 2, textAlign: "left" }}>
                {col.label}
              </Box>
            ))}
            {(onEdit || onDelete) && <Box component="th" sx={{ p: 2, textAlign: "left" }}>Acciones</Box>}
          </Box>
        </Box>

        {/* Cuerpo */}
        <Box component="tbody">
          {filteredData.length > 0 ? (
            filteredData.map((item, rowIndex) => {
              const rowKey = `${(item as any).id ?? (item as any).usuarioId ?? (item as any).clubId ?? (item as any).comentarioId ?? (item as any).carreraId ?? 'row'}-${rowIndex}`;
              return (
                <Box component="tr" key={rowKey} sx={{ borderBottom: "1px solid #ccc" }}>
                  {columns.map((col) => (
                    <Box component="td" sx={{ p: 2 }} key={col.key.toString()}>
                      {col.render ? col.render(item) : (item as any)[col.key]}
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
            })
          ) : (
            <Box component="tr">
              <Box
                component="td"
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                sx={{ p: 2, textAlign: "center" }}
              >
                {emptyMessage}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
