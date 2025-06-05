"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function APIInputForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedKey = localStorage.getItem("APIKey");
    if (storedKey) {
        setShowDialog(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    const res = await fetch("/api/validate-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey }),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      setIsError(true);
      setMessage("Unexpected server response.");
      return;
    }

    if (!res.ok) {
      setIsError(true);
      setMessage(data.error || "Something went wrong.");
    } else {
      setIsError(false);
      setMessage(data.message || "API key validated successfully.");
      localStorage.setItem("APIKey", apiKey);
      router.push("/");
    }
  }

  function handleCancel() {
    setShowDialog(false);
    router.push("/");
  }

  function handleContinue() {
    setShowDialog(false);
    localStorage.removeItem("APIKey");
    setApiKey("");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AlertDialog open={showDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You already have a set API Key!</AlertDialogTitle>
            <AlertDialogDescription>
              By continuing, you will replace your existing API key with a new one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleContinue}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-bold">Revision Website</h1>
            <div className="text-center text-sm">
              Please enter your OpenAI API key to continue.
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="api-key">OpenAI API Key</Label>
              <Input
                id="api-key"
                type="text"
                placeholder="sk-..."
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Continue
            </Button>
            {message && (
              <div
                className={`${
                  isError ? "text-red-500" : "text-green-500"
                } text-xs text-center`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a>
        .<br />
        We do not store your API key, it is only used to authenticate your
        requests to the OpenAI API.
      </div>
    </div>
  );
}