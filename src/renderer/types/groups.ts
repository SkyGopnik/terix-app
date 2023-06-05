import { ConnectionI } from "renderer/types/connection";

export interface GroupI {
  name: string,
  connections?: Array<ConnectionI>
}
