import { useState } from "react";
import { useParams } from "react-router";
import { useDomain } from "@/hooks/useDomain.ts";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  CopyButton,
} from "@repo/ui";
import { AlertTriangle, Terminal, X, Loader2 } from "lucide-react";
import { queryClientGlobal } from "@/lib/tanstack-query/client.ts";
import { CACHE_KEYS } from "@repo/common/queryCacheKeys";

interface RegenerateClientIdModalProps {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
}

export default function RegenerateClientIdModal({
  isOpen,
  onClose,
}: RegenerateClientIdModalProps) {
  const { domainId } = useParams<{ domainId: string }>();
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(
    null,
  );

  const {
    handler: { regenerateClientIdHandler },
    mutations: { regenerateClientIdMutation },
  } = useDomain();

  const isGenerating = regenerateClientIdMutation?.isPending;

  const handleRegenerate = () => {
    if (!domainId) {
      toast.error("Domain ID is missing.");
      return;
    }

    regenerateClientIdHandler({
      data: { domainId },
      callback: (response) => {
        queryClientGlobal?.invalidateQueries({
          queryKey: [CACHE_KEYS?.GET_DOMAINS],
        });
        if (response?.data?.clientId) {
          setNewlyGeneratedKey(response.data.clientId);
        }
      },
    });
  };

  const handleModalClose = (openState: boolean) => {
    onClose(openState);
    if (!openState) {
      setTimeout(() => {
        setNewlyGeneratedKey(null);
        regenerateClientIdMutation.reset();
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogOverlay className="bg-transparent backdrop-blur-[2px]" />

      <DialogContent
        forceMount
        className="sm:max-w-[500px] p-0 border-0 bg-transparent shadow-none [&>button]:hidden overflow-visible"
      >
        <div className="p-2 bg-white/15 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl">
          <div className="bg-white flex flex-col rounded-2xl p-6 w-full h-full border border-gray-100/50">
            <div className="flex items-start justify-between mb-5">
              <DialogHeader className="text-left space-y-1.5">
                <DialogTitle className="text-xl font-semibold tracking-tight text-gray-900">
                  {newlyGeneratedKey
                    ? "Client ID Generated"
                    : "Regenerate Client ID"}
                </DialogTitle>

                {!newlyGeneratedKey && (
                  <p className="text-sm text-gray-500 leading-relaxed pr-4">
                    This will invalidate your current client ID. Any
                    applications using the old key will stop working.
                  </p>
                )}
              </DialogHeader>

              <DialogClose className="text-gray-400 hover:text-gray-900 transition-colors shrink-0 mt-1">
                <X className="w-5 h-5" />
              </DialogClose>
            </div>

            <div className="space-y-6">
              {!newlyGeneratedKey ? (
                <>
                  <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex gap-3.5">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-amber-900">
                        Important Security Warning
                      </h4>
                      <ul className="text-sm text-amber-800/90 space-y-1.5 list-disc list-inside leading-relaxed marker:text-amber-500">
                        <li>Do not share this key with anyone</li>
                        <li>If compromised, regenerate immediately</li>
                        <li>Support will never ask for your secret keys</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleModalClose(false)}
                      disabled={isGenerating}
                      className="h-10 px-4 text-sm font-medium rounded-lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleRegenerate}
                      disabled={isGenerating}
                      className="h-10 px-4 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate New Key"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-blue-50/80 border border-blue-100/80 rounded-xl p-4 flex gap-3">
                    <Terminal className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-blue-900">
                        Copy this key now
                      </h4>
                      <p className="text-sm text-blue-800/80 leading-relaxed">
                        For security reasons, we won't show this key again. If
                        you lose it, you'll need to generate a new one.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Your new client ID
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={newlyGeneratedKey}
                        className="h-10 text-sm font-mono bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg"
                      />
                      <CopyButton value={newlyGeneratedKey} text="Copy" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="button"
                      onClick={() => handleModalClose(false)}
                      className="h-11 w-full text-sm font-medium bg-[#1A1A1A] hover:bg-black text-white shadow-sm transition-colors rounded-lg"
                    >
                      I've saved my key
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
