import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike, deleteLike } from "../api/like";

// v5 cancelQueries/invalidateQueries는 { queryKey } 필터 객체 필요. 배열로 넘기면 전체 쿼리 대상이 됨
const decorKey = (id) => ["decor", id];

export const usePostLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => postLike({ id }),
    // 낙관적 업데이트. 필드명은 API 응답(isLikedByMe)과 맞출 것
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: decorKey(id) });
      const prev = queryClient.getQueryData(decorKey(id));

      if (prev) {
        queryClient.setQueryData(decorKey(id), {
          ...prev,
          isLikedByMe: true,
          likeCount: prev.likeCount + 1,
        });
      }

      return { prev };
    },
    // 실패 시 요청 전 값으로 롤백
    onError: (_err, { id }, context) => {
      if (context?.prev) {
        queryClient.setQueryData(decorKey(id), context.prev);
      }
    },
    // 성공/실패 상관없이 서버 값으로 재조회
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: decorKey(id) });
    },
  });
};

export const useDeleteLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => deleteLike({ id }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: decorKey(id) });
      const prev = queryClient.getQueryData(decorKey(id));

      if (prev) {
        queryClient.setQueryData(decorKey(id), {
          ...prev,
          isLikedByMe: false,
          likeCount: Math.max(0, prev.likeCount - 1),
        });
      }

      return { prev };
    },
    onError: (_err, { id }, context) => {
      if (context?.prev) {
        queryClient.setQueryData(decorKey(id), context.prev);
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: decorKey(id) });
    },
  });
};
