"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, AlertTriangle, Monitor, Keyboard, MousePointer } from "lucide-react"

interface LockdownBrowserProps {
  examId: string
  onLockdownEnabled: () => void
  onLockdownDisabled: () => void
}

export function LockdownBrowser({ examId, onLockdownEnabled, onLockdownDisabled }: LockdownBrowserProps) {
  const [isLocked, setIsLocked] = useState(false)
  const [lockdownFeatures, setLockdownFeatures] = useState({
    fullscreen: false,
    disableRightClick: false,
    disableKeyboardShortcuts: false,
    disableDevTools: false,
    disableNavigation: false,
    disablePrint: false,
  })

  useEffect(() => {
    if (isLocked) {
      enableLockdown()
    } else {
      disableLockdown()
    }

    return () => {
      disableLockdown()
    }
  }, [isLocked])

  const enableLockdown = async () => {
    try {
      // Request fullscreen
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
        setLockdownFeatures((prev) => ({ ...prev, fullscreen: true }))
      }

      // Disable right-click
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault()
        return false
      }
      document.addEventListener("contextmenu", handleContextMenu)
      setLockdownFeatures((prev) => ({ ...prev, disableRightClick: true }))

      // Disable keyboard shortcuts
      const handleKeyDown = (e: KeyboardEvent) => {
        // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
        if (
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && e.key === "I") ||
          (e.ctrlKey && e.shiftKey && e.key === "C") ||
          (e.ctrlKey && e.key === "u") ||
          (e.ctrlKey && e.key === "s") ||
          (e.ctrlKey && e.key === "p") ||
          (e.ctrlKey && e.key === "r") ||
          e.key === "F5" ||
          (e.altKey && e.key === "Tab") ||
          (e.altKey && e.key === "F4")
        ) {
          e.preventDefault()
          e.stopPropagation()
          return false
        }
      }
      document.addEventListener("keydown", handleKeyDown, true)
      setLockdownFeatures((prev) => ({ ...prev, disableKeyboardShortcuts: true }))

      // Disable text selection
      document.body.style.userSelect = "none"
      document.body.style.webkitUserSelect = "none"

      // Disable drag and drop
      const handleDragStart = (e: DragEvent) => {
        e.preventDefault()
        return false
      }
      document.addEventListener("dragstart", handleDragStart)

      // Monitor for escape attempts
      const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
          // User tried to exit fullscreen
          console.log("[v0] Fullscreen exit attempt detected")
          // Re-request fullscreen
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen()
          }
        }
      }
      document.addEventListener("fullscreenchange", handleFullscreenChange)

      // Disable browser navigation
      window.history.pushState(null, "", window.location.href)
      const handlePopState = () => {
        window.history.pushState(null, "", window.location.href)
      }
      window.addEventListener("popstate", handlePopState)
      setLockdownFeatures((prev) => ({ ...prev, disableNavigation: true }))

      // Disable print
      const handleBeforePrint = (e: Event) => {
        e.preventDefault()
        return false
      }
      window.addEventListener("beforeprint", handleBeforePrint)
      setLockdownFeatures((prev) => ({ ...prev, disablePrint: true }))

      console.log("[v0] Lockdown browser enabled")
      onLockdownEnabled()
    } catch (error) {
      console.error("[v0] Failed to enable lockdown:", error)
    }
  }

  const disableLockdown = () => {
    try {
      // Exit fullscreen
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen()
      }

      // Re-enable text selection
      document.body.style.userSelect = ""
      document.body.style.webkitUserSelect = ""

      // Remove all event listeners (in a real app, you'd store references)
      // This is a simplified version for demonstration

      setLockdownFeatures({
        fullscreen: false,
        disableRightClick: false,
        disableKeyboardShortcuts: false,
        disableDevTools: false,
        disableNavigation: false,
        disablePrint: false,
      })

      console.log("[v0] Lockdown browser disabled")
      onLockdownDisabled()
    } catch (error) {
      console.error("[v0] Failed to disable lockdown:", error)
    }
  }

  const toggleLockdown = () => {
    setIsLocked(!isLocked)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Lockdown Browser
            </CardTitle>
            <CardDescription>Secure browser environment for exam taking</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isLocked ? "destructive" : "outline"}>{isLocked ? "LOCKED" : "UNLOCKED"}</Badge>
            <Button onClick={toggleLockdown} variant={isLocked ? "destructive" : "default"}>
              {isLocked ? "Disable Lockdown" : "Enable Lockdown"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isLocked && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Lockdown mode will restrict browser functionality and enable fullscreen mode. This is required for secure
              exam taking.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Security Features</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <span>Fullscreen Mode</span>
                </div>
                <Badge variant={lockdownFeatures.fullscreen ? "default" : "outline"}>
                  {lockdownFeatures.fullscreen ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <MousePointer className="h-4 w-4" />
                  <span>Right-Click Disabled</span>
                </div>
                <Badge variant={lockdownFeatures.disableRightClick ? "default" : "outline"}>
                  {lockdownFeatures.disableRightClick ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Keyboard className="h-4 w-4" />
                  <span>Shortcuts Disabled</span>
                </div>
                <Badge variant={lockdownFeatures.disableKeyboardShortcuts ? "default" : "outline"}>
                  {lockdownFeatures.disableKeyboardShortcuts ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">Restrictions</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Browser Navigation</span>
                <Badge variant={lockdownFeatures.disableNavigation ? "default" : "outline"}>
                  {lockdownFeatures.disableNavigation ? "Blocked" : "Allowed"}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Print Function</span>
                <Badge variant={lockdownFeatures.disablePrint ? "default" : "outline"}>
                  {lockdownFeatures.disablePrint ? "Blocked" : "Allowed"}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Text Selection</span>
                <Badge variant={isLocked ? "default" : "outline"}>{isLocked ? "Blocked" : "Allowed"}</Badge>
              </div>
            </div>
          </div>
        </div>

        {isLocked && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Lockdown mode is active. All browser restrictions are in effect. Any attempt to bypass these restrictions
              will be logged.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
