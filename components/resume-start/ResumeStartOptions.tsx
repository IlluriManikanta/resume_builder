"use client"

import { useRouter } from "next/navigation"
import { FileText, LayoutGrid } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const options: Array<{
  id: string
  icon: typeof FileText
  title: string
  description: string
  buttonLabel: string
  enabled: boolean
  badge?: string
}> = [
  {
    id: "blank",
    icon: FileText,
    title: "Blank resume",
    description: "Start from scratch with guided sections.",
    buttonLabel: "Continue",
    enabled: true,
  },
  {
    id: "template",
    icon: LayoutGrid,
    title: "Start from a template",
    description: "Choose a professional layout and fill it in.",
    buttonLabel: "Browse templates",
    enabled: false,
    badge: "Coming soon",
  },
]

export function ResumeStartOptions() {
  const router = useRouter()

  function handleBlankResume() {
    router.push("/resume/new/builder")
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {options.map((option) => (
        <Card
          key={option.id}
          className={cn(
            "relative flex flex-col border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-200",
            option.enabled
              ? "cursor-pointer hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_0_24px_-4px] hover:shadow-primary/20"
              : "pointer-events-none opacity-50"
          )}
          onClick={
            option.id === "blank" && option.enabled
              ? handleBlankResume
              : undefined
          }
        >
          {option.badge && (
            <Badge
              variant="secondary"
              className="absolute top-4 right-4 bg-secondary text-muted-foreground"
            >
              {option.badge}
            </Badge>
          )}

          <CardHeader className="flex-1 gap-4 pb-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary">
              <option.icon
                className={cn(
                  "h-5 w-5",
                  option.enabled ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <CardTitle className="text-base font-semibold text-foreground">
                {option.title}
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {option.description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardFooter>
            <Button
              className="w-full"
              variant={option.enabled ? "default" : "secondary"}
              disabled={!option.enabled}
              onClick={
                option.id === "blank" && option.enabled
                  ? (e) => {
                      e.stopPropagation()
                      handleBlankResume()
                    }
                  : undefined
              }
            >
              {option.buttonLabel}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
