import {
  useQueries,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getDecorByTypeAndPosition,
  createNewDecor,
  fetchDecorDetail,
  createNewFeedback,
  deleteDecor,
  fetchMyDecors,
  fetchMyFeedbacks,
} from "../api/decor";

import { toast } from "react-toastify";

export const useDecor = (params = {}, isEnabled = true) => {
  const { northLat, southLat, eastLng, westLng, types = [] } = params ?? {};

  const results = useQueries({
    queries: types.map((type) => ({
      queryKey: ["decor", northLat, southLat, eastLng, westLng, type],
      queryFn: () =>
        getDecorByTypeAndPosition({
          northLat,
          southLat,
          eastLng,
          westLng,
          type,
        }),
      enabled:
        isEnabled &&
        !!northLat &&
        !!southLat &&
        !!eastLng &&
        !!westLng &&
        !!type,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);
  const error = results.find((r) => r.isError)?.error;
  const data = results.flatMap((r) => r.data ?? []);

  return { data, isLoading, isError, error };
};

export const useCreateDecor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewDecor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-decors"] });
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

  return useMutation({
    mutationFn: deleteDecor,
    onSuccess: () => {
      toast.success("모종이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["my-decors"] });
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
