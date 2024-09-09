import styles from "./ChatWithModel.module.css";
import { SelectChatPanel } from "./select-chat-panel/SelectChatPanel.tsx";
import {Outlet} from "react-router-dom";

export function ChatWithModel() {
  return (
    <div className={styles.chatWithModel}>
      <div className={styles.fullHeightPanel} style={{minWidth: "20em"}}><SelectChatPanel /></div>
      <div className={styles.fullHeightPanel} style={{flexGrow: 1}}><Outlet /></div>
    </div>
  );
}
