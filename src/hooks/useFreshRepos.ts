import { useQuery } from "react-query";
import { getFreshRepositories } from "../services/github";

export const useFreshRepos = () => {
  return useQuery(
    "freshRepos", 
    ({ signal }) => getFreshRepositories(signal)
  );
};