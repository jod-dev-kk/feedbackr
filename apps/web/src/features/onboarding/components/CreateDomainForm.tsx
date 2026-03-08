import { useDomain } from "@/hooks/useDomain.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { DomainSchema, TDomainPayload } from "@repo/common/schemas";
import { Button, Input, Label } from "@repo/ui";
import { useForm } from "react-hook-form";
export const CreateDomainForm = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<TDomainPayload>({
    mode: "onChange",
    resolver: zodResolver(DomainSchema),
  });

  const {
    handler: { createDomainHandler },
  } = useDomain();

  return (
    <form
      onSubmit={handleSubmit((data) => createDomainHandler({ data }))}
      className="flex flex-col gap-7 w-full"
    >
      <div className="flex flex-col gap-y-1.5">
        <Label>Name of the domain</Label>
        <Input
          type="text"
          {...register("name")}
          placeholder="eg: Example"
          className=""
        />
        {errors && (
          <p className="text-destructive text-xs pt-0.5">
            {errors.name?.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-y-1.5">
        <Label>Domain URL</Label>
        <Input
          {...register("url")}
          placeholder="eg: app.example.com"
          className=""
          onChange={(e) => {
            e.target.value = e.target.value.replace(/\d/, "").trim();
          }}
        />
        {errors && (
          <p className="text-destructive text-xs pt-0.5">
            {errors.url?.message}
          </p>
        )}
      </div>
      <Button className="cursor-pointer">Proceed</Button>
    </form>
  );
};
