import { useEffect, useRef, useState, type HTMLAttributes } from "react";
import type { GithubUser } from "../resources/users";
import { cn } from "../libs/cn/utils";
import { useGithubUser } from "./provider";
import { getGithubUserRepositories, type GithubUserRepository } from "../resources/repositories";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card";
import { IconGitBranch, IconLink, IconLoader2, IconStar } from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip";
import { toast } from "sonner";

const PER_PAGE = 10;

interface Props extends HTMLAttributes<HTMLDivElement> {
  githubUserData: GithubUser
  animationDelay?: number;
}

export default function RepositoryList({ githubUserData, className, ...props }: Props) {
  // resource
  const githubUser = useGithubUser();

  // ui state
  const [isExiting, setIsExiting] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // state
  const [repositories, setRepositories] = useState<GithubUserRepository[]>([]);
  const [pagination, setPagination] = useState({
    hasNextPage: false,
    page: 1,
  });

  // ref
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (githubUser.selectedUser?.id !== githubUserData.id) {
      animateHeightChange([], undefined, true);
    } else {
      fetchRepositories();
    }
  }, [githubUser.selectedUser])

  const fetchRepositories = async (page: number = 1) => {
    if (!githubUserData.login) {
      setRepositories([]);
      return;
    }

    setIsExiting(false);
    setIsLoading(true);
    requestAnimationFrame(() => {
      setIsActive(true);
      setIsExiting(false);
    });
    try {
      const response = await getGithubUserRepositories(githubUserData.login, page, PER_PAGE);

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 2_000);
      })

      const newPagination = {
        hasNextPage: response.length > 0 && response.length >= PER_PAGE,
        page: page,
      };

      if (response) {
        await animateHeightChange(page === 1 ? response : [...repositories, ...response], newPagination);
      } else {
        await animateHeightChange([]);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to fetch repositories", {
        description: "Please try again later.",
      });
    }
  }

  const animateHeightChange = (items: GithubUserRepository[], newPagination: { hasNextPage: boolean, page: number } = { hasNextPage: false, page: 1 }, exit: boolean = false) => {
    return new Promise((resolve) => {
      const container = containerRef.current;
      if (!container) {
        resolve(true);
        return;
      };

      const prevHeight = container.getBoundingClientRect().height;

      requestAnimationFrame(() => {
        if (exit) {
          setIsExiting(true);
          container.style.height = container.getBoundingClientRect().height + "px";
          void container.offsetHeight;
          container.style.transition = "height 400ms cubic-bezier(0.4,0,0.2,1)";
          container.style.height = "0px";
          setTimeout(() => {
            setRepositories(items);
            setPagination(newPagination);
            setIsActive(false);
            container.style.height = "";
            container.style.transition = "";
            resolve(true);
          }, 400);
        } else {
          setIsExiting(false);
          setTimeout(() => {
            setIsExiting(false);
            setIsActive(true);
            setRepositories(items);
            setPagination(newPagination);
            setIsLoading(false);
            requestAnimationFrame(() => {
              const newHeight = container.getBoundingClientRect().height;
              container.style.height = prevHeight + "px";
              void container.offsetHeight;
              container.style.transition = "height 400ms cubic-bezier(0.4,0,0.2,1)";
              container.style.height = newHeight + "px";
              setTimeout(() => {
                container.style.height = "";
                container.style.transition = "";
                resolve(true);
              }, 400);
            });
          }, 400);
        }
      });
    })
  }

  const renderRepositories = () => {
    if (isActive && !isLoading && repositories.length === 0) {
      return (
        <div className="text-sm text-gray-800 px-2.5">
          <p className="text-gray-500">No repositories found.</p>
        </div>
      );
    }

    return (
      <>
        <div className="text-sm text-gray-800 px-2.5 flex items-center justify-between">
          {isLoading ? (
            <>
              <h3 className="text-sm text-neutral-500 font-medium">Loading Repositories...</h3>
              <IconLoader2 className="size-6 animate-spin text-amber-500" />
            </>
          ) : (
            <p>Found {repositories.length} {repositories.length === 1 ? "repository" : "repositories"} for <span className="font-semibold">{githubUserData.login}</span>.</p>
          )}
        </div>
        {repositories.map((repository, index) => (
          <Card
            key={repository.id} className={`p-2.5 block bg-amber-200 border-2 border-amber-400 ${isExiting ? "animate-slideUpOut" : "animate-slideUp"}`}
            style={{
              animationDelay: `${index * 80}ms`,
              animationDuration: "400ms",
            }}
          >
            <CardHeader className="p-0">
              <div className="flex items-center gap-2 justify-between">
                <div className="flex gap-1.5">
                  <h3 className="text-lg font-semibold">{repository.name}</h3>
                  {repository.language && (
                    <h6 className="font-medium  bg-blue-300 rounded-full px-2 text-sm text-blue-800 items-center flex select-none">
                      {repository.language || "Unknown"}
                    </h6>
                  )}
                </div>

                <div className="flex gap-2.5">
                  {repository.forks_count > 0 && (
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="flex items-center text-md font-bold text-yellow-700">
                          <IconGitBranch className="size-5" />
                          {repository.forks_count}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span className="text-sm">Forks</span>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {repository.stargazers_count > 0 && (
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="flex items-center text-md font-bold text-yellow-700">
                          <IconStar className="size-5" />
                          {repository.stargazers_count}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span className="text-sm">Stars</span>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-gray-600">{repository.description || "No description available"}</p>
            </CardContent>

            <CardFooter className="px-0 mt-3">
              <a href={repository.html_url} target="_blank" className="decoration-none">
                <Button className="">
                  View Repository
                  <IconLink />
                </Button>
              </a>
            </CardFooter>
          </Card>
        ))}

        {pagination.hasNextPage && (
          <div
            className={`flex justify-center ${isExiting ? "animate-slideUpOut" : "animate-slideUp"}`}
            style={{
              animationDelay: `${repositories.length * 80}ms`,
              animationDuration: "400ms",
              transition: "opacity 400ms cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <Button
              className="w-full max-w-xs"
              onClick={() => fetchRepositories(pagination.page + 1)}
              disabled={isLoading}
              isLoading={isLoading}
            >
              Load More
            </Button>
          </div>
        )}
      </>
    )
  }

  return (
    <div
      {...props}
      ref={containerRef}
      className={cn(className, isActive ? "flex flex-col gap-3 mt-3 ps-4" : "hidden")}
      style={{ transition: "height 400ms cubic-bezier(0.4,0,0.2,1)" }}
    >
      {renderRepositories()}
    </div>
  )
}