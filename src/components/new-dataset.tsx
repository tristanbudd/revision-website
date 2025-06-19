"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NewDatasetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDatasetAdded?: () => void;
  onDatasetCreated?: (id: string) => void; // Add this
};

function generateId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 8)
  );
}

export function NewDataset({ open, onOpenChange, onDatasetAdded, onDatasetCreated }: NewDatasetProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  function validateName(str: string) {
    return /^[a-zA-Z0-9 _-]{3,32}$/.test(str);
  }
  function validateDescription(str: string) {
    return /^[a-zA-Z0-9 .,'"!?()\-_:;]{10,128}$/.test(str);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateName(name)) {
      setError("Name must be 3-32 characters, no special symbols.");
      return;
    }
    if (!validateDescription(description)) {
      setError("Description must be 10-128 characters, no special symbols.");
      return;
    }

    const sidebarData = JSON.parse(
      localStorage.getItem("sidebarData") ||
        JSON.stringify({
          datasets: [],
          quizzes: [],
          navSecondary: [],
        })
    );

    const nameTaken = sidebarData.datasets.some(
      (ds: any) => ds.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (nameTaken) {
      setError("A dataset with this name already exists.");
      return;
    }

    const id = generateId();
    sidebarData.datasets.push({
      id,
      name,
      description,
      data: []
    });

    localStorage.setItem("sidebarData", JSON.stringify(sidebarData));

    setName("");
    setDescription("");
    setError(null);
    if (onDatasetAdded) onDatasetAdded();
    if (onDatasetCreated) onDatasetCreated(id);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Dataset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={32}
            minLength={3}
            required
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={128}
            minLength={10}
            required
          />
          {error && <div className="text-xs text-red-500">{error}</div>}
          <Button type="submit" className="w-full">
            Create Dataset
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}