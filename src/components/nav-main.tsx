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

export function NavMain() {
  const [open, setOpen] = useState(false)

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Start A New Quiz"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={() => setOpen(true)}
            >
              <IconCirclePlusFilled />
              <span>Start Quiz</span>
            </SidebarMenuButton>
            <SidebarMenuButton
              tooltip="Add A New Dataset"
              variant="outline"
              onClick={() => setOpen(true)}
            >
              <IconDatabase />
              <span>Add Dataset</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Prompt open={open} onOpenChange={setOpen} />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
