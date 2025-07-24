import { Backdrop, CircularProgress, Grid, useTheme } from "@mui/material";
import { FC } from "react"
import { useObservable } from "../Utils/StoreUtil";
import { isLoading$ } from "../Store/AppStore";

const LoadingScreen: FC = () => {

    const theme = useTheme();

    const isLoading = useObservable(isLoading$)

    return <>
        <div>
            <Backdrop open={isLoading} sx={{
                zIndex: theme.zIndex.drawer + 9000,
                color: '#fff',
            }}>
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid>
                        <CircularProgress color="inherit" />
                    </Grid>
                </Grid>
            </Backdrop>
        </div>
    </>
}

export default LoadingScreen;