export interface ConnectionI {
  label: string,
  host: string,
  port: number,
  login: string,
  password: string
}

export interface ExtendedConnectionI extends ConnectionI {
  commands: Array<string>,
  messages: string
}
