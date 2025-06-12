import { useEffect, useRef, useState } from "react";
import { Card } from "../components/ui/card";
import { useGithubUser } from "./provider";
import type { GithubUser } from "../resources/users";
import RepositoryList from "./RepositoryList";
import { Button } from "../components/ui/button";
import { IconSend } from "@tabler/icons-react";

export default function UserList() {
  // resource
  const githubUser = useGithubUser();

  // state
  const [users, setUsers] = useState<GithubUser[]>(githubUser.users);

  // ui state
  const userBufferRef = useRef<GithubUser[]>([]);
  const [isExiting, setIsExiting] = useState(false);

  // ref
  const containerRef = useRef<HTMLDivElement>(null);

  // effects
  useEffect(() => {
    animateContainerHeightChange();
  }, [githubUser.users]);

  const animateContainerHeightChange = () => {
    const container = containerRef.current;
    if (!container) return;

    const prevHeight = container.getBoundingClientRect().height;

    requestAnimationFrame(() => {
      userBufferRef.current = githubUser.users;

      setIsExiting(true);

      setTimeout(() => {
        setIsExiting(false);
        setUsers(userBufferRef.current);

        requestAnimationFrame(() => {
          const newHeight = container.getBoundingClientRect().height;
          container.style.height = prevHeight + "px";

          void container.offsetHeight;
          container.style.transition = "height 400ms cubic-bezier(0.4,0,0.2,1)";
          container.style.height = newHeight + "px";

          setTimeout(() => {
            container.style.height = "";
            container.style.transition = "";
          }, 400);
        });
      }, 400);
    });
  }

  return (
    <div className="box-border overflow-y-hidden grow shrink overflow-x-visible flex flex-col gap-2.5 p-2.5 border-2 rounded-xl border-amber-300 bg-amber-100">
      <p className="text-lg font-semibold text-gray-800 px-2.5 grow-0 shrink-0">
        Showing {users.length} users
      </p>
      <div
        ref={containerRef}
        className="flex flex-col gap-3 transition-all grow shrink overflow-y-auto"
      >
        {users.length ? users.map((user, index) => (
          <div
            key={user.id}
            className={`items-center ${isExiting ? "animate-slideUpOut" : "animate-slideUp"}`}
            style={{
              animationDelay: `${index * 80}ms`,
              animationDuration: "400ms",
            }}
          >
            <Card
              className="flex flex-row gap-3 p-2.5 border-2 border-amber-400 bg-amber-200 transition-all hover:bg-amber-300 cursor-pointer"
              onClick={() => githubUser.setSelectedUser((prev) => {
                if (prev?.id === user.id) {
                  return null;
                }
                return user;
              })}
            >
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-8 h-8 rounded-full aspect-square object-cover grow-0 shrink-0"
              />
              <p className="text-lg font-medium text-gray-700">
                {user.login}
              </p>

              <a href={user.html_url} target="_blank" className="decoration-none ms-auto" onClick={(e) => e.stopPropagation()}>
                <Button className="" size="sm">
                  Visit Profile
                  <IconSend />
                </Button>
              </a>
            </Card>

            <RepositoryList githubUserData={user} />
          </div>
        )) : githubUser.isLoading ? (
          <div className="text-center text-gray-500 p-5">
            Loading users...
          </div>
        ) : (
          <div className="text-center text-gray-500 p-5">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}