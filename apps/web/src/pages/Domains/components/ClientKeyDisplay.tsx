import { Terminal } from "lucide-react";
import { Button, Input, Label, CopyButton } from "@repo/ui";

interface ClientKeyDisplayProps {
  newlyGeneratedKey: string;
  onClose: () => void;
}

export function ClientKeyDisplay({
  newlyGeneratedKey,
  onClose,
}: ClientKeyDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50/80 border border-blue-100/80 rounded-xl p-4 flex gap-3">
        <Terminal className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-blue-900">
            Copy this key now
          </h4>
          <p className="text-sm text-blue-800/80 leading-relaxed">
            For security reasons, we won't show this key again. If you lose it,
            you'll need to generate a new one.
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
          onClick={onClose}
          className="h-11 w-full text-sm font-medium bg-[#1A1A1A] hover:bg-black text-white shadow-sm transition-colors rounded-lg"
        >
          I've saved my key
        </Button>
      </div>
    </div>
  );
}
