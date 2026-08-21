import React, { useCallback, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Tooltip,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import BarraAppMenu from "../components/BarraApp/BarraAppMenu";
import ModalAuditDetail from "../components/Modals/ModalAuditDetail";
import api from "../services/api";
import { AuditRecord, AuditMeta } from "../types/Audit";
import styles from "./Audit.module.css";

const ACTION_COLORS: Record<string, "success" | "warning" | "error" | "default"> = {
  INSERT: "success",
  UPDATE: "warning",
  DELETE: "error",
};

const LIMIT_OPTIONS = [10, 20, 50];

export default function Audit() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [meta, setMeta] = useState<AuditMeta>({ page: 1, limit: 20, total: 0, totalPages: 1 });

  const [filterEntity, setFilterEntity] = useState("");
  const [filterEntityId, setFilterEntityId] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [entities, setEntities] = useState<string[]>([]);

  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    api.get("/audit/entities/list")
      .then(({ data }) => setEntities(data.data))
      .catch(() => setEntities([]));
  }, []);

  const fetchAudit = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      if (filterEntity.trim()) params.append("entity", filterEntity.trim());
      if (filterEntityId.trim()) params.append("entityId", filterEntityId.trim());
      if (filterAction) params.append("action", filterAction);

      const { data } = await api.get(`/audit?${params.toString()}`);
      setRecords(data.data);
      setMeta(data.meta);
    } catch {
      setRecords([]);
    }
  }, [page, limit, filterEntity, filterEntityId, filterAction]);

  useEffect(() => {
    fetchAudit();
  }, [fetchAudit]);

  const handleFilterChange = () => {
    setPage(1);
    fetchAudit();
  };

  const handleLimitChange = (e: SelectChangeEvent<number>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const handleViewDetail = (record: AuditRecord) => {
    setSelectedRecord(record);
    setDetailOpen(true);
  };

  return (
    <>
      <BarraAppMenu />
      <Container maxWidth="lg" className={styles.pageContainer}>
        <Typography variant="h6" className={styles.pageTitle}>
          Auditoria
        </Typography>

        {/* Filtros */}
        <Box className={styles.filtersRow}>
          <FormControl size="small" className={styles.filterEntity}>
            <InputLabel>Entidade</InputLabel>
            <Select
              value={filterEntity}
              label="Entidade"
              onChange={(e) => {
                setFilterEntity(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">Todas</MenuItem>
              {entities.map((entity) => (
                <MenuItem key={entity} value={entity}>
                  {entity}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="ID da Entidade"
            size="small"
            value={filterEntityId}
            onChange={(e) => setFilterEntityId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilterChange()}
          />
          <FormControl size="small" className={styles.filterAction}>
            <InputLabel>Ação</InputLabel>
            <Select
              value={filterAction}
              label="Ação"
              onChange={(e) => {
                setFilterAction(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="INSERT">INSERT</MenuItem>
              <MenuItem value="UPDATE">UPDATE</MenuItem>
              <MenuItem value="DELETE">DELETE</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" className={styles.filterPerPage}>
            <InputLabel>Por página</InputLabel>
            <Select value={limit} label="Por página" onChange={handleLimitChange}>
              {LIMIT_OPTIONS.map((o) => (
                <MenuItem key={o} value={o}>
                  {o}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Tabela - desktop */}
        {!isMobile && (
        <TableContainer component={Paper}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 60 }}></TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Entidade</TableCell>
                <TableCell>ID Entidade</TableCell>
                <TableCell>Ação</TableCell>
                <TableCell>Usuário ID</TableCell>
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>
                      <Tooltip title="Ver detalhes">
                        <IconButton size="small" onClick={() => handleViewDetail(record)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>{record.entityName}</TableCell>
                    <TableCell>{record.entityId}</TableCell>
                    <TableCell>
                      <Chip
                        label={record.action}
                        color={ACTION_COLORS[record.action] ?? "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{record.userId}</TableCell>
                    <TableCell>
                      {new Date(record.createdAt).toLocaleString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        )}

        {/* Cards - mobile */}
        {isMobile && (
          <Box className={styles.mobileCards}>
            {records.length === 0 ? (
              <Typography align="center" color="text.secondary">Nenhum registro encontrado.</Typography>
            ) : (
              records.map((record) => (
                <Card key={record.id} variant="outlined">
                  <CardContent sx={{ pb: 1 }}>
                    <Box className={styles.cardHeader}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Tooltip title="Ver detalhes">
                          <IconButton size="small" onClick={() => handleViewDetail(record)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Typography variant="subtitle2">#{record.id} · {record.entityName} / {record.entityId}</Typography>
                      </Box>
                      <Chip label={record.action} color={ACTION_COLORS[record.action] ?? "default"} size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">Usuário ID: {record.userId}</Typography>
                    <Typography variant="body2" color="text.secondary">{new Date(record.createdAt).toLocaleString("pt-BR")}</Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}

        {/* Paginação */}
        <Box className={styles.paginationRow}>
          <Typography variant="body2" color="text.secondary">
            Total: {meta.total} registro{meta.total !== 1 ? "s" : ""}
          </Typography>
          <Box className={styles.paginationControls}>
            <IconButton
              size="small"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2">
              Página {meta.page} de {meta.totalPages}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Container>

      <ModalAuditDetail
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        record={selectedRecord}
      />
    </>
  );
}
