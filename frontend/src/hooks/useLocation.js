import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCoordinatesFromSharedLink } from "../api/location";

export const useResolveSharedLink = () => {
  return useMutation({
    mutationFn: (sharedUrl) => fetchCoordinatesFromSharedLink(sharedUrl),
  });
};
