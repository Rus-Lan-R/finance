import { ServiceBase } from "@/api/core";

interface IAuth {
  email: string;
  password: string;
}

interface IUserApiResponse<T> {
  message: string;
  data: T;
}


interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export class AuthService extends ServiceBase {
  public static login(data: IAuth): Promise<IUserApiResponse<IUser>> {
    const method = "POST";
    const url = `/v1/login`;

    return ServiceBase.callApi({
      data,
      method,
      url,
    });
  }
}
