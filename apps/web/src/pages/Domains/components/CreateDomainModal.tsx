import { useDomain } from "@/hooks/useDomain.ts";
import { queryClientGlobal } from "@/lib/tanstack-query/client.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { CACHE_KEYS } from "@repo/common/queryCacheKeys";
import { DomainSchema, TDomainPayload } from "@repo/common/schemas";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@repo/ui";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { ClientKeyDisplay } from "./ClientKeyDisplay.tsx";

interface CreateDomainModalProps {
  trigger?: React.ReactNode;
}

export default function CreateDomainModal({ trigger }: CreateDomainModalProps) {
  const [open, setOpen] = useState(false);
  const [generatedData, setGeneratedData] = useState<{
    clientId: string;
    domainId: string;
  } | null>(null);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TDomainPayload>({
    mode: "onChange",
    resolver: zodResolver(DomainSchema),
  });

  const {
    handler: { createDomainHandler },
  } = useDomain();

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (!isOpen) {
      if (generatedData) {
        queryClientGlobal?.removeQueries({
          queryKey: [CACHE_KEYS?.GET_DOMAINS],
        });
        queryClientGlobal?.removeQueries({
          queryKey: [CACHE_KEYS?.GET_FEEDBACK],
        });
        queryClientGlobal?.removeQueries({
          queryKey: [CACHE_KEYS?.GET_FEEDBACKS],
        });

        navigate(`/dashboard/${generatedData.domainId}`);
      }

      setTimeout(() => {
        reset();
        setGeneratedData(null);
      }, 300);
    }
  };

  const onSubmit = async (data: TDomainPayload) => {
    await createDomainHandler({
      data,
      callback: (res) => {
        setGeneratedData({
          clientId: res.data.clientId,
          domainId: res.data.domainId,
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="default" size="sm">
            <Plus className="size-4 mr-2" /> Add Domain
          </Button>
        )}
      </DialogTrigger>

      <DialogOverlay className="bg-transparent backdrop-blur-[2px]" />

      <DialogContent
        forceMount
        className="sm:max-w-[500px] p-0 border-0 bg-transparent shadow-none [&>button]:hidden overflow-visible"
      >
        <div className="p-2 bg-white/15 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl">
          <div className="bg-white rounded-2xl p-6 w-full h-full border border-gray-100/50">
            <div className="flex items-center justify-between mb-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold tracking-tight">
                  {generatedData ? "Domain Created" : "Add New Domain"}
                </DialogTitle>
              </DialogHeader>

              <DialogClose className="text-gray-400 hover:text-gray-900 transition-colors">
                <X className="w-5 h-5" />
              </DialogClose>
            </div>

            {generatedData ? (
              <ClientKeyDisplay
                newlyGeneratedKey={generatedData.clientId}
                onClose={() => handleOpenChange(false)}
              />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <p className="text-sm text-muted-foreground">
                  Add a new domain to start collecting feedback. A unique API
                  key will be generated automatically.
                </p>

                <div className="space-y-4">
                  <div className="flex flex-col gap-y-1.5">
                    <Label htmlFor="name">Name of the domain</Label>
                    <Input
                      id="name"
                      type="text"
                      {...register("name")}
                      placeholder="e.g. Acme Corp"
                    />
                    {errors.name && (
                      <p className="text-destructive text-xs pt-0.5">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-y-1.5">
                    <Label htmlFor="url">Domain URL</Label>
                    <Input
                      id="url"
                      {...register("url")}
                      placeholder="e.g. app.example.com"
                    />
                    {errors.url && (
                      <p className="text-destructive text-xs pt-0.5">
                        {errors.url.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-lg bg-[#1A1A1A] hover:bg-black text-white font-medium mt-2"
                >
                  Create Domain
                </Button>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
