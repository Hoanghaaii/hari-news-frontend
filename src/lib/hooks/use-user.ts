import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api/user";
import { toast } from "sonner";
import { UpdateUserDto, MessageData } from "@/lib/types/api";
import { extractErrorMessage } from "@/lib/utils";

export const useUserById = (id: number | string) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: () => userApi.getUserById(id),
    enabled: !!id,
  });

export const useUser = (params?: { page?: number; pageSize?: number; [key: string]: unknown }) => {
  const queryClient = useQueryClient();

  // Query: danh sách user
  const usersQuery = useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.getUsers(params),
  });

  // Query: profile user hiện tại
  const profileQuery = useQuery({
    queryKey: ["user", "profile"],
    queryFn: userApi.getProfile,
  });

  // Mutation: tạo user
  const createUserMutation = useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      toast.success("Tạo user thành công!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error));
    },
  });

  // Mutation: update user
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateUserDto }) =>
      userApi.updateUser(id, data),
    onSuccess: () => {
      toast.success("Cập nhật user thành công!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error));
    },
  });

  // Mutation: xóa user
  const deleteUserMutation = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: (data: MessageData) => {
      toast.success(data.message || "Xóa user thành công!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error));
    },
  });

  return {
    // Query state
    users: usersQuery.data?.data,
    usersMeta: usersQuery.data?.metadata,
    isLoadingUsers: usersQuery.isLoading,
    userProfile: profileQuery.data?.user,
    isLoadingProfile: profileQuery.isLoading,
    // Query hooks
    // useUserById: truyền id vào hook riêng
    // Mutations
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    // Loading states
    isCreatingUser: createUserMutation.isPending,
    isUpdatingUser: updateUserMutation.isPending,
    isDeletingUser: deleteUserMutation.isPending,
  };
}; 