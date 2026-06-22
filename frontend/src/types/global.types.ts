type PasswordCredentialInit = {
  id?: string;
  name?: string;
  password?: string;
};

type PasswordCredential = {
  id: string;
  name?: string;
  password: string;
  type: "password";
};

declare global {
  interface Window {
    PasswordCredential: {
      prototype: PasswordCredential;
      new (init: PasswordCredentialInit): PasswordCredential;
    };
  }
}
