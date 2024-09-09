import styles from "./Loading.module.css";
import { CircularProgress, Typography } from "@mui/material";

export function Loading() {
  return (
    <div className={styles.loading}>
      <Typography variant={"h4"}>
        Loading <CircularProgress />
      </Typography>
    </div>
  );
}
