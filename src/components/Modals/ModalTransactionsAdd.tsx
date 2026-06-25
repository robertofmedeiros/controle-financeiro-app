import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { FC, useEffect, useState } from "react";
import api from "../../services/api";
import { Transaction } from "../../types/Transaction";
import CurrencyInput from "../Currency/CurrencyInput";
import { error } from "console";
import { notifierStore } from "../Store/NotifierStore";

interface ModalTransactionsAddProperties {
    open: boolean,
    onClose: () => void,
    transacao?: Transaction | null,
    year: number,
    month: number,
}

interface ErrorsFields {
    descricao: {
        error: boolean,
        helperText: string,
    },
    valor: {
        error: boolean,
        helperText: string,
    },
}

const DEFAULT_ERRORSFIELDS: ErrorsFields = {
    descricao: {
        error: false,
        helperText: "",
    },
    valor: {
        error: false,
        helperText: "",
    },
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
    const [errorsFields, setErrorsFields] = useState<ErrorsFields>(DEFAULT_ERRORSFIELDS);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const name = e.target.name as keyof typeof form;
        setForm({ ...form, [name]: e.target.value });
    };

    const handleSubmit = async () => {
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

    useEffect(() => {
        console.log("ModalTransactionsAdd open", open);
        setErrorsFields({...DEFAULT_ERRORSFIELDS});
    }, [open]);

    const validateFields = () => {
        const errors: ErrorsFields = { ...DEFAULT_ERRORSFIELDS };
        const messageError = [];

        errors.descricao.error = false;
        errors.descricao.helperText = "";

        if (!form.descricao.trim()) {
            errors.descricao.error = true;
            errors.descricao.helperText = "Descrição é obrigatória.";
            messageError.push(errors.descricao.helperText);
        }

        errors.valor.error = false;
        errors.valor.helperText = "";

        if (form.valor <= 0) {
            errors.valor.error = true;
            errors.valor.helperText = "Valor deve ser maior que zero.";
            messageError.push(errors.valor.helperText);
        }
        if (Object.values(errors).some(field => field.error)) {
            setErrorsFields(errors);
            notifierStore.setNotifier({
                title: "Aviso",
                content: messageError,
                timeOut: 3500,
                onClose: () => {
                notifierStore.setOpen(false);
                }
            });
            notifierStore.setOpen(true);

            return false;
        }
        setErrorsFields(DEFAULT_ERRORSFIELDS);
        return true;
    }
    return <>
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Nova Transação</DialogTitle>
            <div>
                <DialogContent>
                    <TextField
                        label="Descrição"
                        name="descricao"
                        fullWidth
                        margin="dense"
                        value={form.descricao}
                        onChange={handleChange}
                        error={errorsFields.descricao.error}
                        helperText={errorsFields.descricao.helperText}
                        required
                    />
                    <CurrencyInput 
                        id={"valor"}
                        label="Valor" 
                        value={form.valor}
                        error={errorsFields.valor.error}
                        helperText={errorsFields.valor.helperText}
                        onChange={(value: number) => {
                            setForm({ ...form, valor: value ?  value : 0});
                        }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button onClick={() => {
                        if (validateFields()) {
                            handleSubmit();
                        }
                    }} variant="contained">Salvar</Button>
                </DialogActions>
            </div>
        </Dialog>
    </>
}

export default ModalTransactionsAdd;