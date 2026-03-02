export class NotImplemented extends Error {
  constructor(message: string = "This feature is not yet implemented.") {
    super(message);
    this.name = "NotImplemented";
  }
}