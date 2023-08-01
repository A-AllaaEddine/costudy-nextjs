import { Dispatch, SetStateAction, createContext, useState } from "react";
import { PropsWithChildren } from "react";

type currentUserType = {
  _id: string;
  token: string;
  type: string;
  name: string;
  username: string;
  expiration: number;
  profilePicture: string;
};
type ContextType = {
  currentUser: currentUserType;
  setCurrentUser: Dispatch<SetStateAction<currentUserType>>;
};

export const userContext = createContext<ContextType | undefined>(undefined);

export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  const [currentUser, setCurrentUser] = useState<currentUserType>(null);

  const value = {
    currentUser,
    setCurrentUser,
  };
  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
