import githubAxiosInstance from "../../libs/axios/github-axios-instance";
import { type GithubUsersResponse } from "./";

export async function getGithubUsers(
  query: string,
  page: number = 1,
  perPage: number = 30
): Promise<GithubUsersResponse> {
  return await githubAxiosInstance
    .get<GithubUsersResponse>("/search/users", {
      params: {
        q: query,
        page: page,
        per_page: perPage,
      },
    })
    .then((response) => response.data);
}
