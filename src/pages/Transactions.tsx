import React, { useEffect, useState } from "react";
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
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  TableFooter,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import api from "../services/api";

interface Transaction {
  id: number;
  descricao: string;
  valor: number;
  date: string;
  type: "income" | "expense";
}

function getMonthYearString(year: number, month: number) {
  return new Date(year, month - 1).toLocaleString("default", { month: "long", year: "numeric" });
}

export default function Transactions() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Transaction, "id">>({
    descricao: "",
    valor: 0,
    date: "",
    type: "expense",
  });
  const [valorTotal, setValorTotal] = useState<number>(0);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, [year, month]);

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get(`/lancamentos?ano=${year}&mes=${month}`);
      setTransactions(data);
      setValorTotal(data.reduce((total: number, item: Transaction) => total + item.valor, 0))
    } catch (err) {
      setTransactions([]);
      setValorTotal(0);
    }
  };

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = e.target.name as keyof typeof form;
    setForm({ ...form, [name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/transactions", form);
      fetchTransactions();
      handleClose();
      setForm({ descricao: "", valor: 0, date: "", type: "expense" });
    } catch (err) {
      // Trate o erro conforme necessário
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={handlePrevMonth}><ArrowBackIosNewIcon /></IconButton>
          <Typography variant="h6" sx={{ mx: 2 }}>
            {getMonthYearString(year, month)}
          </Typography>
          <IconButton onClick={handleNextMonth}><ArrowForwardIosIcon /></IconButton>
        </Box>
        <IconButton color="primary" onClick={handleOpen}>
          <AddIcon />
        </IconButton>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Descrição</TableCell>
              <TableCell>Valor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">Sem transações neste mês.</TableCell>
              </TableRow>
            ) : transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.descricao}</TableCell>
                <TableCell>
                    R$ {tx.valor.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
                <TableCell><b>Total</b></TableCell>
                <TableCell colSpan={3}>
                    R$ {valorTotal.toFixed(2)}
                </TableCell>
            </TableRow>
        </TableFooter>
        </Table>
      </TableContainer>

      {/* Modal de nova transação */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Nova Transação</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="Descrição"
              name="description"
              fullWidth
              margin="normal"
              value={form.descricao}
              onChange={handleChange}
              required
            />
            <TextField
              label="Valor"
              name="value"
              type="number"
              fullWidth
              margin="normal"
              value={form.valor}
              onChange={handleChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">Salvar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}