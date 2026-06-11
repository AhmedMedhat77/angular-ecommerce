export interface ILoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IUserAddress {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  country: string;
}

export interface IUserCompany {
  department: string;
  name: string;
  title: string;
  address: IUserAddress;
}

export interface IUserBank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
}

export interface IUserHair {
  color: string;
  type: string;
}

export interface IUserProfile {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: IUserHair;
  address: IUserAddress;
  university: string;
  bank: IUserBank;
  company: IUserCompany;
  role: string;
}
