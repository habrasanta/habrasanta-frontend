import { User } from "../models";
import { postRequest } from "./utils";

export function postMarkRead(user: User, data: { ids: number[] }): Promise<void> {
  return postRequest(`/api/v1/messages/mark_read`, user, data);
}