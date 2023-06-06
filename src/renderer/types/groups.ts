import { ConnectionI } from "renderer/types/connection";

export interface GroupI {
  id: string,
  name: string,
  connections: Array<ConnectionI>
}
