import { InputNode, InputLink } from "@nivo/network";
import { RepoGraphData } from "./repoTypes";
import { ContributorGraphData } from "./contributorTypes";

export interface NetworkNode extends InputNode {
  name: string;
  type: "repo" | "contributor";
}

export type RepoNode = RepoGraphData & NetworkNode & { type: "repo" };

export type ContributorNode = ContributorGraphData & NetworkNode & { type: "contributor" };

export type EitherNode = RepoNode | ContributorNode;

export interface NetworkLink extends InputLink {
  source: string;
  target: string;
  distance: number;
  thickness?: number;
}