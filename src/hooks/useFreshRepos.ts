import { useQuery } from "react-query";
import { getFreshRepositories } from "../services/github";

export const useFreshRepos = () => {
  return useQuery(
    "freshRepos", 
    ({ signal }) => getFreshRepositories(signal),
    {
      staleTime: 2 * 60 * 60 * 1000, // 2 hours
    });
};