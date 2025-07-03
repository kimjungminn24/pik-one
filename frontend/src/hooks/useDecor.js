import { useQueries, useMutation, useQuery } from "@tanstack/react-query";
import {
  getDecorByTypeAndPosition,
  createNewDecor,
  fetchDecorDetail,
  createNewFeedback,
} from "../api/decor";

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
  return useMutation({
    mutationFn: createNewDecor,
  });
};

export function useCreateFeedback(onSuccessCallback) {
  return useMutation({
    mutationFn: createNewFeedback,
    onSuccess: (data) => {
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
