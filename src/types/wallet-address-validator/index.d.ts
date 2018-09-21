declare module 'wallet-address-validator' {
  export interface Validator {
    readonly validate: (
      address: string,
      currency: string,
      network: string
    ) => boolean;
  }

  const validator: Validator;
  export default validator;
}
