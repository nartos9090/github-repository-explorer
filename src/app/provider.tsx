import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import type { GithubUser } from "../resources/users";

interface UserContextType {
  users: GithubUser[];
  setUsers: Dispatch<SetStateAction<GithubUser[]>>
  selectedUser: GithubUser | null;
  setSelectedUser: Dispatch<SetStateAction<GithubUser | null>>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const GithubUserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<GithubUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<GithubUser | null>(null);

  return (
    <UserContext.Provider
      value={{
        users,
        setUsers,
        isLoading,
        setIsLoading,
        selectedUser,
        setSelectedUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useGithubUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
