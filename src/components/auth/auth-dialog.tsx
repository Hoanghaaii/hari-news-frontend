import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { ForgotPasswordForm } from "./forgot-password-form";
import { useRouter } from "next/navigation";

export function AuthDialog({
  open,
  onOpenChange,
  isAuthenticated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAuthenticated: boolean;
}) {
  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated && open) {
      onOpenChange(false);
      router.push("/");
    }
  }, [isAuthenticated, open, onOpenChange, router]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-h-[700px] max-w-md w-full pt-8">
        <Tabs defaultValue="login" className="w-full max-w-md mx-auto">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="login" className="flex-1">
              Đăng nhập
            </TabsTrigger>
            <TabsTrigger value="register" className="flex-1">
              Đăng ký
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
            <div className="text-center text-sm mt-2">
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setShowForgotDialog(true)}
              >
                Quên mật khẩu?
              </button>
            </div>
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
        <Dialog open={showForgotDialog} onOpenChange={setShowForgotDialog}>
          <DialogContent className="min-h-[700px] max-w-md w-full pt-8">
            <ForgotPasswordForm />
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
