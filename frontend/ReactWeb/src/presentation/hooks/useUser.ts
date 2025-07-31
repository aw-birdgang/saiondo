import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Container } from "../../core/di";
import type { User } from "../../core/domain";

export const useUser = () => {
  const container = Container.getInstance();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", "current"],
    queryFn: () => container.getGetCurrentUserUseCase().execute(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateUserMutation = useMutation({
    mutationFn: (userData: Partial<User>) =>
      container.getUpdateUserUseCase().execute(userData),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user", "current"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return {
    user,
    isLoading,
    error,
    refetch,
    updateUser: updateUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,
    updateError: updateUserMutation.error,
  };
};
