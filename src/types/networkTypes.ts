import { InputNode, InputLink } from "@nivo/network";
import { RepoBase } from "./repoTypes";
import { ContributorBase } from "./contributorTypes";

export interface NetworkNode extends InputNode {
  name: string;
  type: "repo" | "contributor";
}

export type RepoNode = RepoBase & NetworkNode & { type: "repo" };

export type ContributorNode = ContributorBase & NetworkNode & { type: "contributor" };

export type EitherNode = RepoNode | ContributorNode;

export interface NetworkLink extends InputLink {
  source: string;
  target: string;
  distance: number;
  thickness?: number;
}