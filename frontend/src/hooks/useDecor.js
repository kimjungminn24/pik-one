import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchAllDecors,
  createNewDecor,
  fetchDecorDetail,
  deleteDecor,
  fetchMyDecors,
} from "../api/decor";

import {
  createNewFeedback,
  fetchMyFeedbacks,
  deleteMyFeedback,
} from "../api/feedback";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

// 지도에 올릴 스팟 전부. 화면 영역 고르기와 묶기는 브라우저에서 한다
export const useAllDecors = () =>
  useQuery({
    queryKey: ["decor", "all"],
    queryFn: fetchAllDecors,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

export const useCreateDecor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewDecor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-decors"] });
      queryClient.invalidateQueries({ queryKey: ["decor"] });
    },
  });
};

export function useCreateFeedback(onSuccessCallback) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNewFeedback,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-feedbacks"] });
      onSuccessCallback?.(data);
    },
  });
}

export const useDecorDetail = (id, enabled) => {
  return useQuery({
    queryKey: ["decor", id],
    queryFn: () => fetchDecorDetail(id),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDeleteDecor = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: deleteDecor,
    onSuccess: (_, { id }) => {
      toast.success(t("toast.decor_delete"));
      queryClient.invalidateQueries({ queryKey: ["my-decors"] });
      queryClient.invalidateQueries({
        queryKey: ["decor"],
        predicate: ({ queryKey }) => !(queryKey.length === 2 && queryKey[1] === id),
      });
    },
  });
};
export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: deleteMyFeedback,
    onSuccess: (_, { id, decorId }) => {
      toast.success(t("toast.feedback_delete"));
      queryClient.invalidateQueries({ queryKey: ["my-feedbacks"] });
      queryClient.setQueryData(["decor", decorId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          feedbacks: oldData.feedbacks.filter((f) => f.id !== id),
        };
      });
    },
  });
};

export const useMyDecorsQuery = () => {
  return useQuery({
    queryKey: ["my-decors"],
    queryFn: fetchMyDecors,
    retry: false,
  });
};

export const useMyFeedbacksQuery = () => {
  return useQuery({
    queryKey: ["my-feedbacks"],
    queryFn: fetchMyFeedbacks,
    retry: false,
  });
};
