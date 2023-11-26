export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export function registerUserMock(userData: UserData): UserData {
  return {
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    password: userData.password,
  };
}
