import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useClubsStore = defineStore("clubs", () => {
  let cashedClubs: any = null;

  async function getClubs() {
    if (cashedClubs) {
      return cashedClubs;
    } else {
      try {
        let { data }: any = await useFetch("/api/clubs/get-clubs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        cashedClubs = data.value;
        return cashedClubs;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  }

  async function createClub(club: Club) {
    try {
      if (club.name === "") {
        toast.warning("Название клуба не должно быть пустым");
      } else {
        let data = await useFetch("/api/clubs/create-club", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ club }),
        });
        cashedClubs = null;
        if (data.data.value === undefined) {
          toast.success("Клуб успешно добавлен");
        } else {
          toast.error("Произошла ошибка при добавлении клуба");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function updateClub(club: Club) {
    try {
      let data = await useFetch("/api/clubs/edit-club", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ club: club }),
      });
      cashedClubs = null;
      toast.success("Клуб успешно обновлен!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function deleteClub(id: number) {
    try {
      let data = await useFetch("/api/clubs/delete-club", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      cashedClubs = null;
      toast.success("Клуб успешно удален!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return { getClubs, createClub, updateClub, deleteClub };
});
