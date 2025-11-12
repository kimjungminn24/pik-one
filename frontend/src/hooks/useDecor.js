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
  deleteDecor,
  fetchMyDecors,
} from "../api/decor";

import { createNewFeedback, fetchMyFeedbacks } from "../api/feedback";
import { toast } from "react-toastify";
import { decorList } from "../decorList";
import { useTranslation } from "react-i18next";

export const useDecor = (params = {}, isEnabled = true) => {
  const {
    northLat,
    southLat,
    eastLng,
    westLng,
    types = [],
    isAllMode,
  } = params ?? {};

  const baseEnabled =
    isEnabled && !!northLat && !!southLat && !!eastLng && !!westLng;

  const queryClient = useQueryClient();

  const allQuery = useQuery({
    queryKey: ["decor", northLat, southLat, eastLng, westLng, null],
    queryFn: async () => {
      const allData = await getDecorByTypeAndPosition({
        northLat,
        southLat,
        eastLng,
        westLng,
      });

      for (const type of decorList.map((d) => d.name)) {
        const filtered = allData.filter((item) => item.type === type);
        queryClient.setQueryData(
          ["decor", northLat, southLat, eastLng, westLng, type],
          filtered
        );
      }
      return allData;
    },

    enabled: baseEnabled && isAllMode,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

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
      enabled: baseEnabled && !isAllMode && !!type,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    })),
  });

  const isLoading = isAllMode
    ? allQuery.isLoading
    : results.some((r) => r.isLoading);

  const isError = isAllMode ? allQuery.isError : results.some((r) => r.isError);

  const error = isAllMode
    ? allQuery.error
    : results.find((r) => r.isError)?.error;

  const data = isAllMode
    ? allQuery.data ?? []
    : results.flatMap((r) => r.data ?? []);
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
  const { t } = useTranslation();
  return useMutation({
    mutationFn: deleteDecor,
    onSuccess: () => {
      toast.success(t("toast.decor_delete"));
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
