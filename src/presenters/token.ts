export class AuthenticatePresenter {
  readonly token: string;

  constructor(entity: {token: string}) {
    this.token = entity.token;
  }
}
