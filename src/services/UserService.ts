import { Pagination, UpdateUserRequest, User, UserProfileForm } from "@/models";
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

export async function fetchPaginateUsers(
  page = 0,
  rowsPerPage = 10,
  search = ""
): Promise<Pagination<User> | null> {
  try {
    const { data } = await http.get<Pagination<User>>("/users/paginate", {
      params: {
        page,
        size: rowsPerPage,
        search,
      },
    });
    return data;
  } catch (error) {
    return null;
  }
}

export async function updateStatusUser(userId: string, isActive: boolean) {
  try {
    const { data } = await http.patch<User>(`/users/${userId}/status`, {
      is_active: isActive,
    });
    return data;
  } catch (error) {
    return null;
  }
}

export async function updateCurrentUser(form: UserProfileForm) {
  try {
    const { data } = await http.put<User>("/users", {
      name: form.name,
      email: form.email,
      phone: form.phone,
      position: form.position,
      change_password: form.changePassword,
      new_password: form.newPassword,
    });

    return data;
  } catch (error) {
    return null;
  }
}

export async function fetchUserByid(id: string) {
  try {
    const { data } = await http.get<User>(`/users/${id}`);
    return data;
  } catch (error) {
    return null;
  }
}

export async function updateUser(userId: string, request: UpdateUserRequest) {
  try {
    const { data } = await http.put<User>(`/users/${userId}`, request);
    return data;
  } catch (error) {
    return null;
  }
}

export async function deleteUserById(userId: string) {
  try {
    await http.delete(`/users/${userId}`);
    return true;
  } catch (error) {
    return false;
  }
}
