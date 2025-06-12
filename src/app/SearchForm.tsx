import { useState, useRef, type HTMLAttributes } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { getGithubUsers } from "../resources/users";
import { useGithubUser } from "./provider";
import { z } from "zod";
import { toast } from "sonner";

const FormSchema = z.object({
  search: z.string().min(1, "Fill the username field"),
})

export default function SearchForm({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  // global state
  const githubUser = useGithubUser()

  // ui state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    let formData;
    try {
      formData = validateInput(event.target as HTMLFormElement);
    } catch {
      // Focus the input if validation fails
      inputRef.current?.focus();
      return;
    }

    setIsLoading(true);
    try {
      const data = await getGithubUsers(formData.search, 1, 5);
      githubUser.setUsers(data.items);
      githubUser.setSelectedUser(null);
    } catch (error) {
      toast.error("Error fetching users", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      })
    }
  }

  const validateInput = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const result = FormSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as Record<string, string>);
      throw new Error("Validation failed");
    }

    setErrors({});
    return result.data;
  }

  return (
    <div {...props} className={`${className}`}>
      <form
        onSubmit={handleSearch}
        className="mb-4"
        onInput={(event) => validateInput(event.currentTarget)}
      >
        <div className="transition-all duration-300" autoFocus>
          <Input
            ref={inputRef}
            name="search"
            type="text"
            className="w-full border-2 rounded-full"
            placeholder="Type username..."
            disabled={isLoading}
            autoFocus
            sizes="xl"
            error={errors.search}
          />
        </div>
        <Button
          type="submit"
          className="mt-2 w-full rounded-full bg-amber-300 border-amber-500 border-2 text-amber-900 hover:bg-amber-400 hover:border-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          variant="outline"
          isLoading={isLoading}
          size="xl"
        >
          Search
        </Button>
      </form>
    </div>
  );
}