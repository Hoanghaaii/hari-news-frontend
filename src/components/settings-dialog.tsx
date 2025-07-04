"use client";

import * as React from "react";
import { Bell, Link, Lock, Paintbrush, Eye, EyeOff } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useUserConfig } from "@/lib/hooks/use-user";
import { useAuth } from "@/lib/hooks/use-auth";
import { Input } from "@/components/ui/input";

const data = {
  nav: [
    { name: "Notifications", icon: Bell },
    { name: "Appearance", icon: Paintbrush },
    { name: "Privacy & visibility", icon: Lock },
    { name: "Social Links", icon: Link },
    { name: "Change Password", icon: Lock },
  ],
};

type SettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = React.useState("Notifications");
  const {
    userConfig,
    isLoadingUserConfig,
    updateUserConfig,
    isUpdatingUserConfig,
  } = useUserConfig();
  const {
    changePassword,
    isChangePasswordLoading,
    forgotPassword,
    isForgotPasswordLoading,
  } = useAuth();

  // Form state cho các trường config
  const [emailNotifications, setEmailNotifications] = React.useState(false);
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [theme, setTheme] = React.useState<"light" | "dark" | "auto">("light");
  const [privacyLevel, setPrivacyLevel] = React.useState<
    "public" | "friends" | "private"
  >("public");
  const [changePw, setChangePw] = React.useState({
    old: "",
    new: "",
    confirm: "",
  });
  const [changePwError, setChangePwError] = React.useState("");
  const [forgotEmail, setForgotEmail] = React.useState("");
  const [showForgot, setShowForgot] = React.useState(false);
  const [showOld, setShowOld] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [socialLinks, setSocialLinks] = React.useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    website: "",
  });
  const [editingSocial, setEditingSocial] = React.useState(false);
  const [socialLinksDraft, setSocialLinksDraft] = React.useState(socialLinks);

  React.useEffect(() => {
    if (userConfig) {
      console.log("socialLinks from BE:", userConfig.socialLinks);
      setEmailNotifications(!!userConfig.preferences?.emailNotifications);
      setPushNotifications(!!userConfig.preferences?.pushNotifications);
      setTheme(
        (userConfig.preferences?.theme as "light" | "dark" | "auto") || "light"
      );
      setPrivacyLevel(
        (userConfig.preferences?.privacyLevel as
          | "public"
          | "friends"
          | "private") || "public"
      );
      setSocialLinks({
        facebook: userConfig.socialLinks?.facebook || "",
        twitter: userConfig.socialLinks?.twitter || "",
        linkedin: userConfig.socialLinks?.linkedin || "",
        instagram: userConfig.socialLinks?.instagram || "",
        website: userConfig.socialLinks?.website || "",
      });
      setSocialLinksDraft({
        facebook: userConfig.socialLinks?.facebook || "",
        twitter: userConfig.socialLinks?.twitter || "",
        linkedin: userConfig.socialLinks?.linkedin || "",
        instagram: userConfig.socialLinks?.instagram || "",
        website: userConfig.socialLinks?.website || "",
      });
    }
  }, [userConfig]);

  // Nội dung từng tab
  let content = null;
  if (activeTab === "Notifications") {
    content = (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Email Notifications</span>
          <Switch
            checked={emailNotifications}
            onCheckedChange={(checked) => {
              setEmailNotifications(checked);
              updateUserConfig({
                preferences: { emailNotifications: checked },
              });
            }}
            disabled={isUpdatingUserConfig}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Push Notifications</span>
          <Switch
            checked={pushNotifications}
            onCheckedChange={(checked) => {
              setPushNotifications(checked);
              updateUserConfig({ preferences: { pushNotifications: checked } });
            }}
            disabled={isUpdatingUserConfig}
          />
        </div>
      </div>
    );
  } else if (activeTab === "Appearance") {
    content = (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Theme</span>
          <div className="flex gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => {
                setTheme("light");
                updateUserConfig({ preferences: { theme: "light" } });
              }}
              disabled={isUpdatingUserConfig}
            >
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => {
                setTheme("dark");
                updateUserConfig({ preferences: { theme: "dark" } });
              }}
              disabled={isUpdatingUserConfig}
            >
              Dark
            </Button>
          </div>
        </div>
      </div>
    );
  } else if (activeTab === "Privacy & visibility") {
    content = (
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <span className="font-medium mb-2">Quyền riêng tư</span>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="privacyLevel"
              value="public"
              checked={privacyLevel === "public"}
              onChange={() => {
                setPrivacyLevel("public");
                updateUserConfig({ preferences: { privacyLevel: "public" } });
              }}
              disabled={isUpdatingUserConfig}
            />
            Công khai
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="privacyLevel"
              value="friends"
              checked={privacyLevel === "friends"}
              onChange={() => {
                setPrivacyLevel("friends");
                updateUserConfig({ preferences: { privacyLevel: "friends" } });
              }}
              disabled={isUpdatingUserConfig}
            />
            Bạn bè
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="privacyLevel"
              value="private"
              checked={privacyLevel === "private"}
              onChange={() => {
                setPrivacyLevel("private");
                updateUserConfig({ preferences: { privacyLevel: "private" } });
              }}
              disabled={isUpdatingUserConfig}
            />
            Riêng tư
          </label>
        </div>
      </div>
    );
  } else if (activeTab === "Social Links") {
    content = (
      <div className="space-y-4 max-w-md">
        {!editingSocial ? (
          <>
            {Object.entries(socialLinks).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-28 capitalize text-sm font-medium">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </span>
                <span className="text-gray-700 break-all">
                  {value || (
                    <span className="text-gray-400 italic">Chưa cập nhật</span>
                  )}
                </span>
              </div>
            ))}
            <Button className="mt-2" onClick={() => setEditingSocial(true)}>
              Cập nhật
            </Button>
          </>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateUserConfig({ socialLinks: socialLinksDraft });
              setEditingSocial(false);
            }}
          >
            {Object.entries(socialLinksDraft).map(([key, value]) => (
              <div key={key}>
                <label
                  className="block text-sm font-medium mb-1 capitalize"
                  htmlFor={key}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <Input
                  id={key}
                  type="text"
                  className="w-full"
                  value={value}
                  placeholder={`Nhập ${key}...`}
                  onChange={(e) =>
                    setSocialLinksDraft((draft) => ({
                      ...draft,
                      [key]: e.target.value,
                    }))
                  }
                  disabled={isUpdatingUserConfig}
                />
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <Button type="submit" disabled={isUpdatingUserConfig}>
                Lưu
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingSocial(false);
                  setSocialLinksDraft(socialLinks);
                }}
              >
                Huỷ
              </Button>
            </div>
          </form>
        )}
      </div>
    );
  } else if (activeTab === "Change Password") {
    content = (
      <div className="space-y-4 max-w-md">
        {!showForgot ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setChangePwError("");
              if (!changePw.old || !changePw.new || !changePw.confirm) {
                setChangePwError("Vui lòng nhập đầy đủ thông tin.");
                return;
              }
              if (changePw.new !== changePw.confirm) {
                setChangePwError("Mật khẩu xác nhận không khớp.");
                return;
              }
              changePassword({
                oldPassword: changePw.old,
                newPassword: changePw.new,
              });
            }}
          >
            <div className="relative mt-2">
              <Input
                type={showOld ? "text" : "password"}
                className="w-full pr-10"
                value={changePw.old}
                onChange={(e) =>
                  setChangePw((p) => ({ ...p, old: e.target.value }))
                }
                autoComplete="current-password"
                placeholder="Nhập mật khẩu cũ"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                tabIndex={-1}
                onClick={() => setShowOld((v) => !v)}
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                className="w-full pr-10"
                value={changePw.new}
                onChange={(e) =>
                  setChangePw((p) => ({ ...p, new: e.target.value }))
                }
                autoComplete="new-password"
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                tabIndex={-1}
                onClick={() => setShowNew((v) => !v)}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                className="w-full pr-10"
                value={changePw.confirm}
                onChange={(e) =>
                  setChangePw((p) => ({ ...p, confirm: e.target.value }))
                }
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                tabIndex={-1}
                onClick={() => setShowConfirm((v) => !v)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {changePwError && (
              <div className="text-destructive text-sm">{changePwError}</div>
            )}
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                className=" hover:cursor-pointer"
                disabled={isChangePasswordLoading}
              >
                Đổi mật khẩu
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-xs hover:cursor-pointer"
                onClick={() => setShowForgot(true)}
              >
                Quên mật khẩu?
              </Button>
            </div>
          </form>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!forgotEmail) return;
              forgotPassword(forgotEmail);
            }}
          >
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                className="w-full"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                autoComplete="email"
                placeholder="Nhập email để lấy lại mật khẩu"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                className="mt-2"
                disabled={isForgotPasswordLoading}
              >
                Gửi mã quên mật khẩu
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-xs"
                onClick={() => setShowForgot(false)}
              >
                Quay lại
              </Button>
            </div>
          </form>
        )}
      </div>
    );
  } else {
    content = <div>Chức năng đang phát triển...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={activeTab === item.name}
                          onClick={() => setActiveTab(item.name)}
                        >
                          <a href="#">
                            <item.icon />
                            <span>{item.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activeTab}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {isLoadingUserConfig ? <div>Đang tải...</div> : content}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
