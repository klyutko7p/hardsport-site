import Cookies from "js-cookie";
import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useUsersStore = defineStore("users", () => {
  const router = useRouter();

  let userData = {} as User;

  function getUser() {
    try {
      const user = Cookies.get("user");
      if (user) {
        return JSON.parse(user);
      }
    } catch (error) {
      return null;
    }
  }

  async function signIn(phoneNumber: string, password: string) {
    try {
      let { data }: any = await useFetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          password,
        }),
      });
      if (!data.value.error) {
        const { userData, token } = data.value.data;

        Cookies.set("token", token, { expires: 7 });
        Cookies.set("user", JSON.stringify(userData), { expires: 7 });

        if (userData.role === "ADMIN") {
          router.push("/admin/workout");
        } else {
          router.push("/user/subscription");
        }
      } else {
        return data?.value?.error || "Unknown error";
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Ошибка во время входа в систему:", error.message);
        return `Ошибка во время входа в систему: ${error.message}`;
      }
    }
  }

  async function signOut() {
    const cookies = Object.keys(Cookies.get());
    cookies.forEach((cookie) => Cookies.remove(cookie));
    localStorage.clear();
    userData = {} as User;
    router.push("/auth/login");
  }

  async function createUser(user: User) {
    try {
      let data = await useFetch("/api/users/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });
      if (data.data.value === undefined) {
        router.push("/auth/login");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function clearCookies(phoneNumber: string, password: string) {
    const cookies = Object.keys(Cookies.get());
    cookies.forEach((cookie) => Cookies.remove(cookie));
    await localStorage.clear();
    userData = {} as User;
    setTimeout(async () => {
      await signIn(phoneNumber, password);
    }, 2000);
  }

  async function getUserById(id: number) {
    try {
      let { data }: any = await useFetch("/api/users/get-user-by-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      return data.value;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function getUsers() {
    try {
      let { data }: any = await useFetch("/api/users/get-users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return data.value;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function updateUser(user: User) {
    try {
      let data = await useFetch("/api/users/edit-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: user }),
      });
      toast.success("Пользователь успешно обновлен!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function deleteUser(id: number) {
    try {
      let data = await useFetch("/api/users/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      toast.success("Пользователь успешно удален!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  function getNormalizedDate(date: number | Date | string | null) {
    if (date) {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        day: "numeric",
        month: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Europe/Moscow",
      };
      return new Date(date).toLocaleString("ru-RU", options);
    }
  }

  function getNormalizedDateWithoutTime(date: number | Date | string | null) {
    if (date) {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        day: "numeric",
        month: "2-digit",
        timeZone: "Europe/Moscow",
      };
      return new Date(date).toLocaleString("ru-RU", options);
    }
  }

  function getISODateTime(dateData: Date | string | number) {
    const date = new Date(dateData);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    const outputDate = `${year}-${month}-${day}T${hour}:${minute}`;
    return outputDate;
  }

  function getISODate(dateData: Date | string | number) {
    const date = new Date(dateData);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const outputDate = `${year}-${month}-${day}`;
    return outputDate;
  }

  return {
    userData,
    signIn,
    signOut,
    getUser,
    createUser,
    getUsers,
    getNormalizedDate,
    getISODateTime,
    updateUser,
    deleteUser,
    getNormalizedDateWithoutTime,
    clearCookies,
    getISODate,
    getUserById,
  };
});
