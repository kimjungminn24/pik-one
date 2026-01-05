import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike, deleteLike } from "../api/like";
import { useTranslation } from "react-i18next";

export const usePostLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => postLike({ id }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(["decor", id]);
      const prev = queryClient.getQueryData(["decor", id]);
      queryClient.setQueryData(["decor", id], (old) => ({
        ...old,
        likedByMe: true,
        likeCount: old.likeCount + 1,
      }));
      return { prev };
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries(["decor", id]);
    },
  });
};

export const useDeleteLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => deleteLike({ id }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(["decor", id]);

      const prev = queryClient.getQueryData(["decor", id]);

      if (prev) {
        queryClient.setQueryData(["decor", id], {
          ...prev,
          likedByMe: false,
          likeCount: Math.max(0, prev.likeCount - 1),
        });
      }

      return { prev };
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries(["decor", id]);
    },
  });
};
