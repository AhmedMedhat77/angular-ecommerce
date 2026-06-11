import { IUser } from './user';

export interface ILoginResponse extends Partial<IUser> {
  accessToken: string;
  refreshToken: string;
}
