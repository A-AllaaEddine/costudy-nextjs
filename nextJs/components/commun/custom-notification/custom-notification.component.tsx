import { useContext, useEffect } from "react";
import styles from "./CustomNotification.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { notificationsContext } from "@/contexts/notifications.context";

const CustomNotification = () => {
  const { removeNotification, notifications } =
    useContext(notificationsContext);

  useEffect(() => {
    notifications?.forEach((notification) => {
      const notificationTimeout = setTimeout(() => {
        removeNotification(notification.id);
      }, 3000);

      return () => clearTimeout(notificationTimeout);
    });
  }, [notifications]);
  return (
    <div className={styles.notificationsContainer}>
      {notifications?.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          position={"top_center"}
          message={notification.message}
          type={notification.type}
          removeNotification={removeNotification}
        />
      ))}
    </div>
  );
};

type Props = {
  position: "top_center" | "top_left" | "top_right";
  message: string;
  id: number;
  type: "error" | "success" | "warning";
  removeNotification: (id: number) => void;
};

const Notification = ({
  position,
  message,
  id,
  type,
  removeNotification,
}: Props) => {
  let style;
  switch (position) {
    case "top_center":
      style = { justifyContent: "center" };
      break;
    case "top_left":
      style = { justifyContent: "flex-start" };
      break;
    case "top_right":
      style = { justifyContent: "flex-end" };
      break;
    default:
      break;
  }

  let classname, icon;
  switch (type) {
    case "warning":
      classname = styles.warning;
      icon = (
        <ErrorOutlineOutlinedIcon
          className={styles.statusIcon}
          style={{ color: "#ffb325" }}
        />
      );
      break;
    case "error":
      classname = styles.error;
      icon = (
        <ErrorOutlinedIcon
          className={styles.statusIcon}
          style={{ color: "#ff4336" }}
        />
      );
      break;
    case "success":
      classname = styles.success;
      icon = (
        <CheckCircleIcon
          className={styles.statusIcon}
          style={{ color: "#50e722" }}
        />
      );
      break;
  }
  return (
    <div
      //   className={`${styles.notification}_${type}_${position}`}
      className={`${styles.notification} ${classname}`}
      style={style}
    >
      {icon}
      <p>{message}</p>
      <CloseIcon
        className={styles.icon}
        onClick={() => removeNotification(id)}
      />
    </div>
  );
};

export default CustomNotification;
