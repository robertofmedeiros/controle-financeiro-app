import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { FC } from "react";
import { AuditRecord } from "../../types/Audit";
import styles from "./ModalAuditDetail.module.css";

interface ModalAuditDetailProps {
  open: boolean;
  onClose: () => void;
  record: AuditRecord | null;
}

const ACTION_COLORS: Record<string, "success" | "warning" | "error" | "default"> = {
  INSERT: "success",
  UPDATE: "warning",
  DELETE: "error",
};

function formatValue(value: any): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function isChanged(field: string, oldState: Record<string, any> | null, newState: Record<string, any> | null): boolean {
  const oldVal = oldState ? oldState[field] : undefined;
  const newVal = newState ? newState[field] : undefined;
  return formatValue(oldVal) !== formatValue(newVal);
}

const ModalAuditDetail: FC<ModalAuditDetailProps> = ({ open, onClose, record }) => {
  if (!record) return null;

  const allFields = Array.from(
    new Set([
      ...Object.keys(record.oldState ?? {}),
      ...Object.keys(record.newState ?? {}),
    ])
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      sx={{
        "& .MuiDialog-paper": {
          width: { xs: "98%", sm: "50%" },
          maxWidth: { xs: "98%", sm: "50%" },
          m: { xs: "1%", sm: 2 },
        },
      }}
    >
      <DialogTitle>
        <Box className={styles.titleBox}>
          Auditoria #{record.id}
          <Chip
            label={record.action}
            color={ACTION_COLORS[record.action] ?? "default"}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Entidade: <strong>{record.entityName}</strong> · ID: <strong>{record.entityId}</strong> · Usuário ID: <strong>{record.userId}</strong> · {new Date(record.createdAt).toLocaleString("pt-BR")}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ overflowX: "hidden" }}>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead>
              <TableRow className={styles.tableHeader}>
                <TableCell sx={{ width: "25%" }}><strong>Campo</strong></TableCell>
                <TableCell sx={{ width: "37.5%" }}><strong>Valor Anterior</strong></TableCell>
                <TableCell sx={{ width: "37.5%" }}><strong>Novo Valor</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allFields.map((field) => {
                const changed = isChanged(field, record.oldState, record.newState);
                return (
                  <TableRow
                    key={field}
                    className={changed ? styles.changedRow : undefined}
                  >
                    <TableCell className={changed ? styles.fieldNameChanged : styles.fieldName}>{field}</TableCell>
                    <TableCell className={changed ? styles.oldValueChanged : styles.oldValue}>
                      {formatValue(record.oldState?.[field])}
                    </TableCell>
                    <TableCell className={changed ? styles.newValueChanged : styles.newValue}>
                      {formatValue(record.newState?.[field])}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAuditDetail;
