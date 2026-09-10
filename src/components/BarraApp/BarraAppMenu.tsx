import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import styles from "./BarraAppMenu.module.css";

const BarraAppMenu: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    return <>
        <AppBar position="static">
            <Toolbar>
                <Box className={styles.navGroup}>
                    <Typography
                        variant="subtitle1"
                        color="inherit"
                        className={`${styles.navLink} ${location.pathname === "/transactions" ? styles.navLinkActive : ""}`}
                        onClick={() => navigate("/transactions")}
                    >
                        Lançamentos
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="inherit"
                        className={`${styles.navLink} ${location.pathname === "/audit" ? styles.navLinkActive : ""}`}
                        onClick={() => navigate("/audit")}
                    >
                        Auditoria
                    </Typography>
                </Box>
                <Typography
                    variant="subtitle2"
                    component="div"
                    color="inherit"
                    className={styles.username}
                >
                    {useAuth().user?.username}
                </Typography>
                <LogoutIcon className={styles.logoutButton} onClick={useAuth().signOut} />
            </Toolbar>
        </AppBar>
    </>
}

export default BarraAppMenu;