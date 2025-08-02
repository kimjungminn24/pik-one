import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postIssue, getIssues } from "../api/issue";

export const ISSUE_QUERY_KEY = ["issues"];

export const useCreateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ISSUE_QUERY_KEY });
    },
  });
};

export const useGetIssues = (enabled) => {
  return useQuery({
    queryKey: ISSUE_QUERY_KEY,
    queryFn: getIssues,
    enabled,
  });
};
