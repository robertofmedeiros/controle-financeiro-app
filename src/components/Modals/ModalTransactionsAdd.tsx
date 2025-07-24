import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { FC, useEffect, useState } from "react";
import api from "../../services/api";
import { Transaction } from "../../types/Transaction";
import CurrencyInput from "../Currency/CurrencyInput";

interface ModalTransactionsAddProperties {
    open: boolean,
    onClose: () => void,
    transacao?: Transaction | null,
    year: number,
    month: number,
}

const ModalTransactionsAdd: FC<ModalTransactionsAddProperties> = ({
    open,
    onClose,
    transacao,
    year,
    month,
}) => {

    const [form, setForm] = useState<Omit<Transaction, "id">>({
        descricao: "",
        valor: 0,
        date: "",
        type: "expense",
        mes: month,
        ano: year,
      });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const name = e.target.name as keyof typeof form;
        setForm({ ...form, [name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log(">>>", transacao);
            if (transacao?.id) {
                await api.put("/lancamentos/" + transacao?.id, form);
            } else {
                await api.post("/lancamentos", form);
            }
            onClose();
            setForm({ descricao: "", valor: 0, date: "", type: "expense", ano: year, mes: month});
        } catch (err) {
            // Trate o erro conforme necessário
        }
    };

    useEffect(() => {
        setForm(transacao || {
        descricao: "",
        valor: 0,
        date: "",
        type: "expense",
        mes: month,
        ano: year,
      });
    }, [transacao])
    return <>
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Nova Transação</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        label="Descrição"
                        name="descricao"
                        fullWidth
                        margin="normal"
                        value={form.descricao}
                        onChange={handleChange}
                        required
                    />
                    <CurrencyInput 
                        id={"valor"}
                        label="Valor" 
                        value={form.valor} 
                        onChange={(value: number) => {
                            setForm({ ...form, valor: value ?  value : 0});
                        }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="contained">Salvar</Button>
                </DialogActions>
            </form>
        </Dialog>
    </>
}

export default ModalTransactionsAdd;