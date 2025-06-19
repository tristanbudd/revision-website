"use client";
import * as React from "react"
import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { RequireApiKey } from "@/components/require-api-key";

function DatasetDetails({ datasetId }: { datasetId: string | null }) {
  const [dataset, setDataset] = useState<any>(null);

  React.useEffect(() => {
    if (!datasetId || datasetId === "delete") {
      setDataset(null);
      return;
    }
    const stored = localStorage.getItem("sidebarData");
    if (stored) {
      try {
        const sidebarData = JSON.parse(stored);
        const found = sidebarData.datasets?.find((ds: any) => ds.id === datasetId);
        setDataset(found || null);
      } catch {
        setDataset(null);
      }
    }
  }, [datasetId]);

  if (!datasetId || datasetId === "delete") {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4 text-white">Welcome to Revision Website</h1>
        <p className="mb-4 text-muted-foreground">
          Select a dataset from the sidebar or create a new one to get started.
        </p>
      </div>
    );
  }
  if (!dataset) {
    return <div className="p-8 text-red-500">Dataset not found.</div>;
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">{dataset.name}</h1>
      <p className="mb-4 text-muted-foreground">{dataset.description}</p>
      <h2 className="text-lg font-semibold mb-2">Data</h2>
      {dataset.data.length === 0 ? (
        <div className="text-sm text-muted-foreground">No data in this dataset yet.</div>
      ) : (
        <pre className="bg-muted p-4 rounded">{JSON.stringify(dataset.data, null, 2)}</pre>
      )}
    </div>
  );
}

export default function Home() {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
  const [sidebarRefresh, setSidebarRefresh] = useState(0);

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <RequireApiKey />
      <AppSidebar
        onSelectDataset={setSelectedDatasetId}
        refresh={sidebarRefresh}
        setSidebarRefresh={setSidebarRefresh}
        setSelectedDatasetId={setSelectedDatasetId}
        selectedDatasetId={selectedDatasetId}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <DatasetDetails datasetId={selectedDatasetId} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}