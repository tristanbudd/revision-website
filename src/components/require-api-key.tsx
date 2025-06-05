"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RequireApiKey() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const apiKey = localStorage.getItem("APIKey");
      if (!apiKey) {
        router.replace("/authenticate");
      }
    }
  }, [router]);

  return null;
}