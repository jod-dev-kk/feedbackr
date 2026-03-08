import { useAuth } from "@/features/auth/hooks.ts";
import { useDomain } from "@/hooks/useDomain.ts";
import { cn } from "@/lib/utils.ts";
import CreateDomainModal from "@/pages/Domains/components/CreateDomainModal.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@repo/ui";
import { FeedbackrLogo } from "@repo/ui/icons";
import {
  Box,
  ChevronDown,
  Flag,
  Globe,
  LogOut,
  Plus,
  Settings2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

export function AppSidebar() {
  const { signOut, userSession } = useAuth();
  const user = userSession.data?.user;

  const navigate = useNavigate();
  const params = useParams<{
    domainId: string;
  }>();

  const domainId = params.domainId ?? null;

  const {
    data: { domains },
  } = useDomain();

  const DASHBOARD_ROUTE = `/dashboard/${domainId}`;

  const ROUTES = [
    {
      name: "Dashboard",
      href: DASHBOARD_ROUTE,
      icon: Box,
    },
    {
      name: "Feedbacks",
      href: `${DASHBOARD_ROUTE}/feedbacks`,
      icon: Flag,
    },
    {
      name: "Domains",
      href: `${DASHBOARD_ROUTE}/domains`,
      icon: Globe,
    },
    {
      name: "Settings",
      href: `${DASHBOARD_ROUTE}/Settings`,
      icon: Settings2,
    },
  ];
  return (
    <Sidebar className="bg-muted/80 border-none">
      <SidebarHeader className="bg-muted/80 w-full">
        <div className="inline-flex items-center justify-between">
          <FeedbackrLogo className="size-10 ml-1.5" />
          <SidebarTrigger className="bg-muted text-foreground! hover:bg-neutral-200! cursor-pointer shrink-0" />
        </div>
        <DropdownMenu>
          <div className="flex flex-col">
            <SidebarGroupLabel className="">Switch Domain</SidebarGroupLabel>

            <DropdownMenuTrigger asChild className="w-full">
              <Button
                variant={"outline"}
                className="flex items-center justify-between gap-x-3 w-full hover:text-foreground/80 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-foreground/80">
                      {
                        domains.find((item) => item.id === params.domainId!)
                          ?.url
                      }
                    </p>
                  </div>
                  <ChevronDown />
                </div>
              </Button>
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent
            align="start"
            className="w-[270px] border-border"
          >
            <DropdownMenuGroup>
              {/* <DropdownMenuLabel
                asChild
                className="text-xs text-foreground/70 pb-2.5"
              >
                <div
                  data-section="domain"
                  className="flex items-center justify-between gap-x-2  text-neutral-400 font-normal"
                >
                  <p className="uppercase">Domains</p>
                </div>
              </DropdownMenuLabel> */}
              {domains && domains?.length > 0 ? (
                domains.map((itemUnit, idx) => {
                  const isActive = params.domainId === itemUnit.id;
                  return (
                    <div key={itemUnit.id}>
                      <DropdownMenuItem
                        asChild
                        className={cn(
                          `focus:bg-neutral-200 text-neutral-700! hover:bg-muted! hover:text-neutral-700! font-medium group`,
                          isActive &&
                            "bg-secondary! text-primary! [&_svg]:text-primary!",
                        )}
                        onClick={() => {
                          navigate(`/dashboard/${itemUnit.id}`);
                        }}
                      >
                        <div className="flex justify-between w-full cursor-pointer">
                          <div className="flex items-center gap-x-1">
                            <Globe className="size-[13px] mt-px" />
                            <p className="text-xs">{itemUnit.name}</p>
                          </div>
                          <p className="font-normal text-xs">{itemUnit.url}</p>
                        </div>
                      </DropdownMenuItem>
                      {idx !== domains.length - 1 && <DropdownMenuSeparator />}
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center text-xs h-10 text-neutral-400">
                  <span>No domains found</span>
                </div>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="p-0" />

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
      </SidebarHeader>

      <SidebarContent className="bg-muted/80">
        <SidebarGroup>
          <SidebarGroupLabel className="">Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {ROUTES.map((route) => {
                const Icon = route.icon;
                const isActive = location.pathname === route.href;
                return (
                  <SidebarMenuItem key={route.href}>
                    <SidebarMenuButton
                      asChild
                      className={
                        isActive
                          ? "text-[13px] bg-neutral-200 rounded-md text-neutral-600 hover:bg-neutral-300/70 hover:text-neutral-700 font-medium gap-1.5"
                          : "hover:bg-neutral-300/50 text-[13px] gap-1.5 text-neutral-500"
                      }
                    >
                      <Link to={route.href}>
                        <Icon className="size-4! -mt-px" />
                        <span>{route.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="bg-border" />
      <SidebarFooter className="bg-muted/80">
        <div className="pt-3 pb-1 flex flex-col gap-3">
          <div className="flex items-center gap-2 select-none">
            <Avatar>
              <AvatarImage src={user?.image as string} />
              <AvatarFallback>{user?.name}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-xs">
              <p className="font-semibold">{user?.name}</p>
              <p>{user?.email}</p>
            </div>
          </div>
          <Button
            variant={"outline"}
            className="hover:text-destructive cursor-pointer"
            onClick={() => signOut()}
            asChild
          >
            <div className="inline-flex items-center">
              <p>Logout</p>
              <LogOut size={18} />
            </div>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
