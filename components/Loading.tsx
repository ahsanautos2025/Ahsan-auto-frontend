import { cn } from "@/lib/utils"

const Loading = () => (
  <div
    className={cn(
      "fixed top-1/2 left-1/2 z-50 flex h-0 w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center",
      "animate-spin rounded-full border-b-2 border-white"
    )}
    style={{ borderColor: "transparent" }}
  />
)

export default Loading
