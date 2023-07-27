import { User } from "@/models";
import http from "@/utils/http";

export async function fetchAlluser() {
  try {
    const { data } = await http.get<User[]>("/users");
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
