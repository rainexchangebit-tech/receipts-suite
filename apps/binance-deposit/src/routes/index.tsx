import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { EditorPanel } from "@/components/editor-panel";
import { PhoneFrame } from "@/components/phone-frame";
import { ReceiptScreen } from "@/components/receipt-screen";
import { StudioToolbar } from "@/components/studio-toolbar";
import { useReceiptStore } from "@/lib/receipt-store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const receipt = useReceiptStore((s) => s.receipt);

  useEffect(() => {
    void Promise.resolve(useReceiptStore.persist.rehydrate());
  }, []);

  return (
    <div className="studio">
      <StudioToolbar />
      <div className="studio-body">
        <EditorPanel />
        <PhoneFrame>
          <ReceiptScreen receipt={receipt} />
        </PhoneFrame>
      </div>
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#121318",
            border: "1px solid rgba(234,236,239,0.12)",
            color: "#eaecef",
            fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
          },
        }}
      />
    </div>
  );
}
