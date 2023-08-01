import { createContext, useState } from "react";
import { PropsWithChildren } from "react";

type ContextType = {
  notifications: notificationType[];
  setNotifications: (notifications: []) => void;
  removeNotification: (id: number) => void;
  addNotification: (type: notificationTypeType, message: string) => void;
};

type notificationTypeType = "success" | "warning" | "error";

type notificationType = {
  id: number;
  message: string;
  type: notificationTypeType;
};

export const notificationsContext = createContext<ContextType | undefined>(
  undefined
);

export const NotificationsProvider = ({ children }: PropsWithChildren<{}>) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = (id: number) => {
    setNotifications(
      notifications.filter(
        (notification: notificationType) => notification.id !== id
      )
    );
  };

  const addNotification = (
    type: notificationTypeType,
    message: string
  ): void => {
    if (notifications.length >= 3) {
      setNotifications((prev) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = {
          id,
          message,
          type,
        };

        // Return the updated notifications array with the latest notification at the beginning
        return [newNotification, ...prev.slice(0, 2)];
      });
    } else {
      // The notifications array has less than three notifications, simply add the new one
      setNotifications((prev) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = {
          id,
          message,
          type,
        };

        return [newNotification, ...prev];
      });
    }
  };

  const value = {
    notifications,
    setNotifications,
    removeNotification,
    addNotification,
  };
  return (
    <notificationsContext.Provider value={value}>
      {children}
    </notificationsContext.Provider>
  );
};
