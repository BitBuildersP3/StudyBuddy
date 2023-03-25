import dayjs from "dayjs/esm";

export class Registration {
  constructor(public login: string, public email: string, public password: string, public langKey: string, public phone: string, public degree: string, public birthDay: string) {}
}
