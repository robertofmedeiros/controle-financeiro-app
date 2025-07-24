import { ReactNode } from "react";
import { notifierStore } from "../Store/NotifierStore";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { observer } from "mobx-react-lite";

const Notifier = observer(() => {
  const contentNotifier = (content: any): ReactNode => {
    if (typeof content === "string") {
      return <>{content}</>
    } else {
      if (Array.isArray(content)) {
        return <>{content.map(rec => <>{rec}<br /></>)}</>
      } else {
        return content;
      }
    }
  }

  return (
    <div>
      <Dialog open={notifierStore.getOpen()} style={{ minWidth: "300px" }}>
        <div
          onMouseEnter={() => notifierStore.onMouseEnter()}
          id="notifier-container"
        >
          <DialogTitle id="simple-dialog-title">
            {notifierStore.getTitle()}
          </DialogTitle>
          <DialogContent style={{ minWidth: "300px" }}>
            <DialogContentText id="alert-dialog-description">
              {contentNotifier(notifierStore.getContent())}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => {
                notifierStore.getOnClose()
            }}>OK</Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
});

export { Notifier };
