"use client";
import { useState } from "react";
import { useUser, useUserById } from "@/lib/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, Trash2, Edit } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const {
    users,
    usersMeta,
    isLoadingUsers,
    createUser,
    isCreatingUser,
    updateUser,
    isUpdatingUser,
    deleteUser,
    isDeletingUser,
  } = useUser({ page, pageSize });
  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState<null | number>(null);
  const [openEdit, setOpenEdit] = useState<null | number>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editForm, setEditForm] = useState<{ name?: string }>({});

  // Xem user chi tiết
  const userView = useUserById(openView as number);
  const userEdit = useUserById(openEdit as number);

  // Pagination logic
  const totalPages = usersMeta?.totalPages || 1;
  const currentPage = usersMeta?.page || page;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách User</h1>
        <Button onClick={() => setOpenCreate(true)}>+ Tạo user mới</Button>
      </div>
      {isLoadingUsers ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" /> Đang tải...
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{u.status}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setOpenView(u.id)}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setOpenEdit(u.id);
                        setEditForm({ name: u.name || "" });
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => deleteUser(u.id)}
                      disabled={isDeletingUser}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <div className="text-right text-xs mt-2 text-muted-foreground">
            Tổng: {usersMeta?.total || users?.length || 0}
          </div>
        </>
      )}

      {/* Dialog tạo user */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="max-w-md w-full">
          <h2 className="font-bold text-lg mb-4">Tạo user mới</h2>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              createUser(form);
              setOpenCreate(false);
              setForm({ name: "", email: "", password: "" });
            }}
          >
            <div>
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
                type="email"
              />
            </div>
            <div>
              <Label>Tên</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label>Mật khẩu</Label>
              <Input
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                required
                type="password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isCreatingUser}>
              {isCreatingUser ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : null}
              Tạo user
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog xem user */}
      <Dialog open={!!openView} onOpenChange={() => setOpenView(null)}>
        <DialogContent className="max-w-md w-full">
          <h2 className="font-bold text-lg mb-4">Thông tin user</h2>
          {userView.isLoading ? (
            <div className="flex items-center">
              <Loader2 className="animate-spin mr-2" /> Đang tải...
            </div>
          ) : userView.data ? (
            <div className="space-y-2 text-sm">
              <div>
                <b>ID:</b> {userView.data.id}
              </div>
              <div>
                <b>Email:</b> {userView.data.email}
              </div>
              <div>
                <b>Tên:</b> {userView.data.name}
              </div>
              <div>
                <b>Role:</b> {userView.data.role}
              </div>
              <div>
                <b>Trạng thái:</b> {userView.data.status}
              </div>
              <div>
                <b>Ngày tạo:</b> {userView.data.created_at}
              </div>
              <div>
                <b>Avatar:</b> {userView.data.avatar || "-"}
              </div>
              <div>
                <b>Bio:</b> {userView.data.bio || "-"}
              </div>
              <div>
                <b>Phone:</b> {userView.data.phone || "-"}
              </div>
              <div>
                <b>City:</b> {userView.data.city || "-"}
              </div>
            </div>
          ) : (
            <div>Không tìm thấy user.</div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog edit user */}
      <Dialog open={!!openEdit} onOpenChange={() => setOpenEdit(null)}>
        <DialogContent className="max-w-md w-full">
          <h2 className="font-bold text-lg mb-4">Cập nhật user</h2>
          {userEdit.isLoading ? (
            <div className="flex items-center">
              <Loader2 className="animate-spin mr-2" /> Đang tải...
            </div>
          ) : userEdit.data ? (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                updateUser({
                  id: userEdit.data!.id,
                  data: { name: editForm.name },
                });
                setOpenEdit(null);
              }}
            >
              <div>
                <Label>Tên</Label>
                <Input
                  value={editForm.name || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isUpdatingUser}
              >
                {isUpdatingUser ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : null}
                Lưu
              </Button>
            </form>
          ) : (
            <div>Không tìm thấy user.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
