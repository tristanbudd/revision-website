"use client"

import {
  IconFolder,
  IconTrash,
  IconDots,
  IconDatabase,
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function NavDatasets({
  onSelectDataset,
  refresh,
  selectedDatasetId,
}: {
  onSelectDataset: (id: string) => void;
  refresh?: number;
  selectedDatasetId?: string | null;
}) {
  const { isMobile } = useSidebar()
  const [datasets, setDatasets] = useState<
    { name: string; url: string; icon: typeof IconDatabase; id?: string }[]
  >([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedDatasets = localStorage.getItem("sidebarData")
    if (storedDatasets) {
      try {
        const sidebarData = JSON.parse(storedDatasets)
        if (sidebarData.datasets) {
          setDatasets(
            sidebarData.datasets.map((ds: any) => ({
              name: ds.name,
              url: `/datasets/${ds.id}`,
              icon: IconDatabase,
              id: ds.id,
            }))
          )
        }
      } catch {
        setDatasets([])
      }
    } else {
      setDatasets([])
    }
  }, [refresh])

  function handleDelete(id: string | undefined) {
    if (!id) return
    const storedDatasets = localStorage.getItem("sidebarData")
    if (storedDatasets) {
      try {
        const sidebarData = JSON.parse(storedDatasets)
        if (sidebarData.datasets) {
          sidebarData.datasets = sidebarData.datasets.filter(
            (ds: any) => ds.id !== id
          )
          localStorage.setItem("sidebarData", JSON.stringify(sidebarData))
          setDatasets(
            sidebarData.datasets.map((ds: any) => ({
              name: ds.name,
              url: `/datasets/${ds.id}`,
              icon: IconDatabase,
              id: ds.id,
            }))
          )
        }
      } catch {}
    }
    setDeleteId(null)
    if (selectedDatasetId === id) {
      onSelectDataset("delete")
    }
  }

  function handleOpen(id: string) {
    onSelectDataset(id)
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Datasets</SidebarGroupLabel>
      <SidebarMenu>
        {datasets.length === 0 ? (
          <div className="text-xs text-muted-foreground px-2 py-2">
            No datasets found.<br />Add datasets by selecting "Add Dataset".
          </div>
        ) : (
          datasets.map((item) =>
            item.id ? (
              <SidebarMenuItem key={item.id} className="flex items-center">
                <SidebarMenuButton asChild>
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      onSelectDataset(item.id!);
                    }}
                  >
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="ml-2 p-1 rounded hover:bg-muted"
                      aria-label="Open dataset menu"
                      type="button"
                    >
                      <span className="sr-only">Open menu</span>
                      <IconDots className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-24 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem onClick={() => handleOpen(item.id!)}>
                      <IconFolder />
                      <span>Open</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDeleteId(item.id!)}
                    >
                      <IconTrash />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ) : null
          )
        )}
      </SidebarMenu>
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete dataset?</AlertDialogTitle>
          </AlertDialogHeader>
          <div>This action cannot be undone. Are you sure you want to delete this dataset?</div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(deleteId ?? undefined)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarGroup>
  )
}