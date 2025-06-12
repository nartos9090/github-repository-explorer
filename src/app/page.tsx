import { GithubUserProvider } from "./provider";
import SearchForm from "./SearchForm";
import UserList from "./UserList";

export default function AppPage() {
  return (
    <GithubUserProvider>
      <div className="w-screen h-screen overflow-y-hidden bg-gray-100 flex items-center justify-center">
        <div className="w-[32rem] p-5 gap-5 overflow-y-hidden flex flex-col max-h-full">
          <div>
            <h1 className="text-2xl font-bold text-center mb-4">
              GitHub User Search
            </h1>
            <p className="text-center text-gray-600">
              Search for GitHub users and view their profiles.
            </p>
          </div>
          <SearchForm className="grow-0 shrink-0" />
          <UserList />
        </div>
      </div>
    </GithubUserProvider>
  )
}