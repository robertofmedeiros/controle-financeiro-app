import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';

const BarraAppMenu: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    return <>
        <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
            <Toolbar>
                {/* Nome do usuário à esquerda */}
                <Box sx={{ flexGrow: 1, paddingLeft: "2%", display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                        variant="subtitle1"
                        color="inherit"
                        sx={{ cursor: "pointer", borderBottom: location.pathname === "/transactions" ? "2px solid white" : "2px solid transparent", pb: 0.2 }}
                        onClick={() => navigate("/transactions")}
                    >
                        Lançamentos
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="inherit"
                        sx={{ cursor: "pointer", borderBottom: location.pathname === "/audit" ? "2px solid white" : "2px solid transparent", pb: 0.2 }}
                        onClick={() => navigate("/audit")}
                    >
                        Auditoria
                    </Typography>
                </Box>
                {/* Título do app à direita */}
                <Typography
                    variant="subtitle2"
                    component="div"
                    color="inherit"
                    sx={{ mr: 2 }}
                >
                    {useAuth().user?.username}
                </Typography>
                {/* Botão de deslogar */}
                <LogoutIcon onClick={useAuth().signOut}/>

            </Toolbar>
        </AppBar>
    </>
}

export default BarraAppMenu;