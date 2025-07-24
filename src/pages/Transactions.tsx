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
  Box,
  IconButton,
  TableFooter,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import api from "../services/api";
import { Transaction } from "../types/Transaction";
import ModalTransactionsAdd from "../components/Modals/ModalTransactionsAdd";
import { CurrencyUtil } from "../components/Utils/CurrencyUtil";
import BarraAppMenu from "../components/BarraApp/BarraAppMenu";

function getMonthYearString(year: number, month: number) {
  return new Date(year, month - 1).toLocaleString("default", { month: "long", year: "numeric" });
}

export default function Transactions() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [open, setOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, [year, month]);

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get(`/lancamentos?ano=${year}&mes=${month}`);
      setTransactions(data);
    } catch (err) {
      setTransactions([]);
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

  return <>
    <BarraAppMenu />
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={handlePrevMonth}><ArrowBackIosNewIcon /></IconButton>
          <Typography variant="h6" sx={{ mx: 2, width: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
            {getMonthYearString(year, month)}
          </Typography>
          <IconButton onClick={handleNextMonth}><ArrowForwardIosIcon /></IconButton>
        </Box>
        <IconButton color="primary" onClick={handleOpen}>
          <AddIcon />
        </IconButton>
      </Box>
      <TableContainer component={Paper}>
        <Table size="medium">
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
              <TableRow key={tx.id} onClick={() => {
                setCurrentTransaction(tx);
                setOpen(true);
                console.log(">>>", tx);
              }}>
                <TableCell>{tx.descricao}</TableCell>
                <TableCell>
                  {CurrencyUtil.formatCurrency(Number(tx.valor.toFixed(2)))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell><b>Total</b></TableCell>
              <TableCell colSpan={3}>
                {CurrencyUtil.formatCurrency(Number(transactions.reduce((total: number, item: Transaction) => total + item.valor, 0).toFixed(2) || 0))}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* Modal de nova transação */}
      <ModalTransactionsAdd
        open={open}
        transacao={currentTransaction}
        year={year}
        month={month}
        onClose={() => {
          setOpen(false);
          setCurrentTransaction(null);
          fetchTransactions();
        }} />
    </Container>
  </>;
}