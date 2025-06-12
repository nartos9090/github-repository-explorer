import type { GithubUser } from "../resources/users";

export type AppState = {
  users: GithubUser[];
  selectedUser: GithubUser | null;
  isLoading: boolean;
};
