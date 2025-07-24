import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { isAuthenticated, login } from "../../services/auth";
import { notifierStore } from "../Store/NotifierStore";

export default function Login() {
  const [loginUsuario, setLoginUsuario] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await api.post('/auth/login', { login: loginUsuario, senha: password });
      login(response.data.access_token);
      navigate('/transactions');
    } catch {
      notifierStore.setNotifier({
        title: "Aviso",
        content: 'Credenciais inválidas',
        timeOut: 3500,
        onClose: () => {
          notifierStore.setOpen(false);
        }
      })
      notifierStore.setOpen(true);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/transactions');
    }
  }, [isAuthenticated()]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" marginTop="15%">
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 360, margin: "2%" }}>
        <Typography variant="h5" mb={2} align="center">Login</Typography>
        <div>
          <TextField
            label="login"
            type="text"
            fullWidth
            margin="normal"
            value={loginUsuario}
            onChange={e => setLoginUsuario(e.target.value)}
            required
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth sx={{ mt: 2 }}
            onClick={() => {
              handleSubmit();
            }}>
            Entrar
          </Button>
        </div>
      </Paper>
    </Box>
  );
}