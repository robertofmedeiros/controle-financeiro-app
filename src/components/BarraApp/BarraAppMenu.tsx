import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import { useAuth } from "../../hooks/useAuth";
import LogoutIcon from '@mui/icons-material/Logout';

const BarraAppMenu: FC = () => {
    return <>
        <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
            <Toolbar>
                {/* Nome do usuário à esquerda */}
                <Box sx={{ flexGrow: 1, paddingLeft: "2%" }}>
                    <Typography variant="subtitle1" color="inherit">
                        Lançamentos Financeiros
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