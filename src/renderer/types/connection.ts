export interface ConnectionI {
  id: string,
  label: string,
  host: string,
  port: number,
  login: string,
  password: string,
  groupId: string
}

export interface ExtendedConnectionI extends ConnectionI {
  commands: Array<string>,
  messages: string
}
