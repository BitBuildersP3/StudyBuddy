export class Registration {
// Altere el constructor para agregar los campos que se agregaron a la clase ExtraUserInfo.
  constructor(public login: string, public email: string, public password: string, public langKey: string, public phone: string, public degree: string, public profilePicture: string, public birthDay: string ) {}
}
