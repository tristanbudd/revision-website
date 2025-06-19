"use client"

import { useState } from "react"
import { IconCirclePlusFilled, IconDatabase } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Prompt } from "@/components/prompt"
import { NewDataset } from "@/components/new-dataset"

export function NavMain({
  setSidebarRefresh,
  setSelectedDatasetId,
}: {
  setSidebarRefresh: React.Dispatch<React.SetStateAction<number>>;
  setSelectedDatasetId: (id: string) => void;
}) {
  const [promptOpen, setPromptOpen] = useState(false)
  const [newDatasetOpen, setNewDatasetOpen] = useState(false)

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Start A New Quiz"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={() => setPromptOpen(true)}
            >
              <IconCirclePlusFilled />
              <span>Start Quiz</span>
            </SidebarMenuButton>
            <SidebarMenuButton
              tooltip="Add A New Dataset"
              variant="outline"
              onClick={() => setNewDatasetOpen(true)}
            >
              <IconDatabase />
              <span>Add Dataset</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Prompt open={promptOpen} onOpenChange={setPromptOpen} />
        <NewDataset
          open={newDatasetOpen}
          onOpenChange={setNewDatasetOpen}
          onDatasetAdded={() => setSidebarRefresh(r => r + 1)}
          onDatasetCreated={setSelectedDatasetId}
        />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
