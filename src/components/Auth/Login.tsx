import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { isAuthenticated, login } from "../../services/auth";
import { notifierStore } from "../Store/NotifierStore";
import styles from "./Login.module.css";
import { ERROR_LOGIN_FIELDS } from "../../types/ErrosFields";

export default function Login() {
  const [loginUsuario, setLoginUsuario] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const [errorFields, setErrorFields] = useState(ERROR_LOGIN_FIELDS);

  const handleSubmit = async () => {

    const _errorFields = { ...errorFields };

    if (!loginUsuario) {
      _errorFields.login.error = true;
      _errorFields.login.helperText = 'Campo login obrigatório';
    }

    if (!password) {
      _errorFields.password.error = true;
      _errorFields.password.helperText = 'Campo senha obrigatório';
    }


    setErrorFields(_errorFields);

    if (_errorFields.login.error || _errorFields.password.error) {
      return;
    }

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
    setLoginUsuario('');
    setPassword('');
    setErrorFields(ERROR_LOGIN_FIELDS);
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/transactions');
    }
  }, [navigate]);

  const handleKeyDown = (e: any) => {
    console.log(">>>handleKeyDown", e.key);
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <Box className={styles.loginWrapper}>
      <Paper elevation={3} className={styles.loginCard}>
        <Typography variant="h5" className={styles.loginTitle} align="center">Login</Typography>
        <div>
          <TextField
            label="login"
            type="text"
            fullWidth
            margin="normal"
            value={loginUsuario}
            onChange={e => setLoginUsuario(e.target.value)}
            required
            error={errorFields.login.error}
            helperText={errorFields.login.helperText}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: errorFields.login.sucess ? '#2e7d32 !important' : undefined,
              },
              '& .MuiInputLabel-root': {
                color: errorFields.login.sucess ? '#2e7d32 !important' : undefined,
              },
            }}
            onBlur={() => {
              const _loginUsuario = loginUsuario.trim();

              if (_loginUsuario && _loginUsuario !== "") {
                const _errorFields = { ...errorFields };
                _errorFields.login.error = false;
                _errorFields.login.helperText = '';
                _errorFields.login.sucess = true;
                setErrorFields(_errorFields);
              } else {
                const _errorFields = { ...errorFields };
                _errorFields.login.error = true;
                _errorFields.login.helperText = 'Campo login obrigatório';
                _errorFields.login.sucess = false;
                setErrorFields(_errorFields);
              }
            }}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            required
            error={errorFields.password.error}
            helperText={errorFields.password.helperText}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: errorFields.password.sucess ? '#2e7d32 !important' : undefined,
              },
              '& .MuiInputLabel-root': {
                color: errorFields.password.sucess ? '#2e7d32 !important' : undefined,
              },
            }}
            onBlur={() => {

              if (password && password !== "") {
                const _errorFields = { ...errorFields };
                _errorFields.password.error = false;
                _errorFields.password.helperText = '';
                _errorFields.password.sucess = true;
                setErrorFields(_errorFields);
              } else {
                const _errorFields = { ...errorFields };
                _errorFields.password.error = true;
                _errorFields.password.helperText = 'Campo senha obrigatório';
                _errorFields.password.sucess = false;
                setErrorFields(_errorFields);
              }

            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className={styles.loginButton}
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