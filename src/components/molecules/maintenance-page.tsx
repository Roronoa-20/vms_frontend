import { AlertTriangle, Clock, Wrench } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
              <Wrench className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-balance">{"We'll be back soon!"}</CardTitle>
            <CardDescription className="text-muted-foreground text-pretty">
              Our website is currently undergoing scheduled maintenance to improve your experience.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Maintenance Mode
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>Expected downtime: 2-4 hours</span>
              </div>

              <div className="text-sm text-muted-foreground">
                Started:{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Thank you for your patience. We apologize for any inconvenience.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
