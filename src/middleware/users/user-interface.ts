export enum UserRoles {
  CONTRIBUTOR = "contributor",
  MAINTAINER = "maintainer",
}

export interface UserIn {
  name: string;
  email: string;
  password: string;
  role?: UserRoles;
}
