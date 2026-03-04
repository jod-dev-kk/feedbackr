import { cn } from "@/lib/utils.ts";
import { IDomainType } from "@/services/getDomainService/useGetDomainService.types.ts";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Switch,
} from "@repo/ui";
import {
  AlertTriangle,
  ChevronDown,
  Copy,
  Globe,
  Plus,
  RefreshCcw,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import RegenerateClientIdModal from "./RegenerateClientIdModal.tsx";
import { useState } from "react";
import { useCopyToClipboard } from "@/hooks/useCopyClipboard.ts";
import CreateDomainModal from "@/pages/Domains/components/CreateDomainModal.tsx";

interface DomainsSectionProps {
  domains: IDomainType[];
  selectedDomain: IDomainType | undefined;
  onStatusChange: (id: string, checked: boolean) => void;
}

export const DomainsSection = ({
  domains,
  selectedDomain,
  onStatusChange,
}: DomainsSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const embedSnippet = selectedDomain
    ? `<script src="https://cdn.feedbackwidget.io/v1/widget.js" data-client-id="${selectedDomain.clientId}"></script>`
    : "";

  const { copyToClipboard } = useCopyToClipboard();

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-sm font-medium text-foreground">Domains</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Manage domains and view installation credentials
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-xs text-foreground">Select domain</Label>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"outline"}
                className="flex items-center justify-between gap-x-3 w-full hover:text-foreground/80 cursor-pointer h-10 px-3 bg-background"
                disabled={domains.length === 0}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {selectedDomain ? (
                      <>
                        <p className="text-sm text-foreground/80 font-medium">
                          {selectedDomain.name || selectedDomain.url}
                        </p>
                      </>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Select a domain
                      </span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="w-(--radix-dropdown-menu-trigger-width) min-w-[300px] border-border p-1"
            >
              <DropdownMenuGroup>
                {domains.map((domain, idx) => {
                  const isSelected = selectedDomain?.id === domain.id;
                  return (
                    <div key={domain.id}>
                      <DropdownMenuItem
                        className={cn(
                          `focus:bg-neutral-200 text-neutral-700! hover:bg-muted! hover:text-neutral-700! font-medium group cursor-pointer py-2`,
                          isSelected &&
                            "bg-secondary! text-primary! [&_svg]:text-primary!",
                        )}
                        onClick={() =>
                          navigate(`/dashboard/${domain?.id}/settings`)
                        }
                      >
                        <div className="flex justify-between w-full items-center">
                          <div className="flex items-center gap-x-2">
                            <Globe className="size-[13px]" />
                            <p className="text-xs font-medium">{domain.name}</p>
                          </div>
                          <p className="font-normal text-xs text-muted-foreground group-hover:text-neutral-700">
                            {domain.url}
                          </p>
                        </div>
                      </DropdownMenuItem>
                      {idx !== domains.length - 1 && <DropdownMenuSeparator />}
                    </div>
                  );
                })}
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1" />

              <CreateDomainModal
                trigger={
                  <DropdownMenuItem
                    asChild
                    onSelect={(e) => e.preventDefault()}
                    className={cn(
                      `focus:bg-neutral-200 text-neutral-700! hover:bg-muted! hover:text-neutral-700! font-medium group  cursor-pointer`,
                    )}
                  >
                    <div
                      data-section="domain"
                      className="flex items-center justify-center gap-x-1  text-neutral-400 font-normal"
                    >
                      <Plus size={18} className="mb-px" />
                      <p className="text-xs">Create a domain</p>
                    </div>
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {selectedDomain ? (
          <>
            <div className="flex items-center justify-between py-1 my-2">
              <div>
                <Label className="text-xs text-foreground">Enable domain</Label>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Allow this domain to collect feedback
                </p>
              </div>
              <Switch
                checked={selectedDomain?.status === "ACTIVE"}
                onCheckedChange={(checked) => {
                  console.log("switch", checked);
                  onStatusChange(selectedDomain.id, checked);
                }}
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded p-3 flex gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <div className="space-y-2">
                <p className="text-xs text-amber-900 font-medium">
                  Keep your client ID secure
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Do not share this key with anyone. If you suspect it has been
                  compromised, regenerate a new one immediately.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-foreground">Client ID</Label>
              <div className="flex gap-2">
                <Input
                  value={"pk_**************** "}
                  readOnly
                  className="h-9 text-sm font-mono bg-muted/50 text-muted-foreground"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-xs gap-1.5 min-w-20"
                onClick={() => setIsModalOpen(true)}
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Regenerate Client ID
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-foreground">
                Installation snippet
              </Label>
              <div className="relative group">
                <pre className="text-[11px] font-mono bg-neutral-950 text-neutral-300 p-4 rounded-md border border-neutral-800 overflow-x-auto">
                  {embedSnippet}
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 h-7 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyToClipboard(embedSnippet, "Snippet")}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Add this script before the closing <code>&lt;/body&gt;</code>{" "}
                tag
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 border border-dashed rounded-md bg-muted/10 text-muted-foreground text-sm">
            <p>No domain selected</p>
          </div>
        )}
      </div>
      <RegenerateClientIdModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};
