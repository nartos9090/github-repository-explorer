import githubAxiosInstance from "../../libs/axios/github-axios-instance";
import type { GithubUserRepository } from "./type";

export function getGithubUserRepositories(
  username: string,
  page: number = 1,
  perPage: number = 30
): Promise<GithubUserRepository[]> {
  return githubAxiosInstance
    .get<GithubUserRepository[]>(`/users/${username}/repos`, {
      params: {
        page: page,
        per_page: perPage,
      },
    })
    .then((response) => response.data);
}
