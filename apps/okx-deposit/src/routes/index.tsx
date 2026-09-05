import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Studio } from "@/components/slip/studio";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <>
      <Studio />
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#181a1e",
            border: "1px solid #2a2c32",
            color: "#f3f2ee",
          },
        }}
      />
    </>
  );
}
