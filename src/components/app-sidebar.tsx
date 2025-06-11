"use client"

import * as React from "react"
import {
  IconCamera,
  IconFileAi,
  IconFileDescription,
  IconHelp,
  IconReport,
  IconBrandGithub,
  IconLogout,
  IconDatabase
} from "@tabler/icons-react"

import { useState } from "react";
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

import { NavQuizzes } from "@/components/nav-quizzes"
import { NavDatasets } from "@/components/nav-datasets"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"

const data = {
  datasets: [
    {
      name: "Example Dataset",
      url: "#",
      icon: IconReport,
    }
  ],
  quizzes: [
    {
      name: "Example Quiz",
      url: "#",
      icon: IconDatabase,
    }
  ],
  navSecondary: [
    {
      title: "Report An Issue",
      url: "https://github.com/tristanbudd/revision-website/issues",
      icon: IconHelp,
      target: "_blank",
    },
    {
      title: "View On GitHub",
      url: "https://github.com/tristanbudd/revision-website",
      icon: IconBrandGithub,
      target: "_blank",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/authenticate";
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-base font-semibold">Revision Website</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavQuizzes items={data.quizzes} />
        <NavDatasets items={data.datasets} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setShowLogoutDialog(true)}
        >
          <IconLogout className="mr-2 size-4" />
          Log Out
        </Button>
        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Log out?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out? <br />
                <span className="font-semibold text-red-500">All data will also be deleted.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowLogoutDialog(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Log Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  )
}
