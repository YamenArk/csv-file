export interface Usecase<Input, Output> {
    execute(input: Input): Output;
  }
  