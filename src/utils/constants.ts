export enum GameStatus {
  None = 0,
  Pending = 1,
  Accepted = 2,
  Rejected = 3,
  Allocated = 4,
  Funded = 5,
  Active = 6,
  Completed = 7,
}

export enum AlloStatus {
  None = 0,
  Pending = 1,
  Accepted = 2,
  Rejected = 3,
  Appealed = 4,
  InReview = 5,
  Canceled = 6,
}

export enum GrantStatus {
  None,
  Applied,
  ShipRejected,
  ShipApproved,
  FacilitatorRejected,
  FacilitatorApproved,
  MilestonesProposed,
  MilestonesRejected,
  MilestonesApproved,
  MilestoneSubmitted,
  MilestoneRejected,
  MilestoneApproved,
  Completed,
}

export enum UpdateScope {
  Game,
  Ship,
}

export enum PosterRole {
  Project,
  Ship,
  Facilitator,
  Reviewer,
  RootAccount,
}

export enum PostDecorator {
  Update,
  Clarify,
  Appeal,
}

export enum ContentSchema {
  BasicUpdate, // { text: string }
}
