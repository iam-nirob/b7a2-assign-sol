export enum UserRoles {
  CONTRIBUTOR = "contributor",
  MAINTAINER = "maintainer",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: UserRoles;
}
