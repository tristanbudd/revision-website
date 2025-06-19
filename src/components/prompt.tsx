"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconPointer, IconClick, IconFileInvoice, IconFileInvoiceFilled } from "@tabler/icons-react";

const datasets = {
  "example": { name: "Example", description: "This is an example dataset." },
};

const aiModels = [
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    price: 0.0005,
    description: "Fast, low-cost, suitable for most tasks.",
  },
  {
    id: "gpt-3.5-turbo-0125",
    name: "GPT-3.5 Turbo 0125",
    price: 0.0005,
    description: "Latest GPT-3.5 Turbo snapshot.",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    price: 0.005,
    description: "OpenAI's new GPT-4o, more capable, higher cost.",
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    price: 0.01,
    description: "Advanced, higher cost.",
  },
];

type PromptProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type QuizType = "single" | "multi" | "fill" | "write" | null;

export function Prompt({ open, onOpenChange }: PromptProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [quizType, setQuizType] = useState<QuizType>(null);
  const [selectedDataset, setSelectedDataset] = useState<string>("");
  const [amount, setAmount] = useState<number>(10);
  const [selectedModel, setSelectedModel] = useState<string>(aiModels[0].id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setQuizType(null);
      setSelectedDataset("");
      setAmount(10);
      setSelectedModel(aiModels[0].id);
      setError(null);
    }
  }, [open]);

  const estimatedTokens = amount * 50;
  const modelPrice = aiModels.find((m) => m.id === selectedModel)?.price ?? 0;
  const estimatedCost = ((estimatedTokens / 1000) * modelPrice).toFixed(4);

  function handleQuizType(type: QuizType) {
    setQuizType(type);
    setStep(2);
  }

  function handleStartQuiz() {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Quiz Type</DialogTitle>
            </DialogHeader>
            <div className="text-sm mb-2">
              Please select a type of quiz you would like to create.
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleQuizType("single")}
            >
              <IconPointer className="mr-2" /> Single-Choice Questions
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleQuizType("multi")}
            >
              <IconClick className="mr-2" /> Multi-Choice Questions
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleQuizType("fill")}
            >
              <IconFileInvoice className="mr-2" /> Fill-In-The-Blank Questions
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              disabled
            >
              <IconFileInvoiceFilled className="mr-2" />
              Write-In Questions
              <Badge className="ml-2" variant="destructive">
                Work In Progress
              </Badge>
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>Quiz Settings</DialogTitle>
            </DialogHeader>
            <div className="mb-2">
              <label className="block text-sm mb-1">Select Data Set</label>
              <Select
                value={selectedDataset}
                onValueChange={setSelectedDataset}
                disabled={Object.keys(datasets).length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a data set..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(datasets).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {Object.keys(datasets).length === 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  No datasets found. Please add one from the sidebar.
                </div>
              )}
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">Amount of Questions</label>
              <Input
                type="number"
                min={1}
                max={25}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                placeholder="Enter amount"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">AI Model</label>
              <Select
                value={selectedModel}
                onValueChange={setSelectedModel}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select AI model..." />
                </SelectTrigger>
                <SelectContent>
                  {aiModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}{" "}
                      <span className="text-xs text-muted-foreground">
                        ({model.description})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-2 text-xs text-muted-foreground">
              Estimated token cost: <span className="font-semibold">{estimatedTokens}</span>
              <br />
              Estimated price: <span className="font-semibold">${estimatedCost}</span>
            </div>
            <Button
              className="w-full"
              onClick={handleStartQuiz}
              disabled={!selectedDataset || amount < 1}
            >
              Start Quiz
            </Button>
            <div
              className="text-red-500 text-xs mt-2"
              style={{ display: error ? "block" : "none" }}
              aria-live="polite"
            >
              {error}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}