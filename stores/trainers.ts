import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useTrainersStore = defineStore("trainers", () => {
  let cashedTrainers: any = null;

  async function getTrainers() {
    if (cashedTrainers) {
      return cashedTrainers;
    } else {
      try {
        let { data }: any = await useFetch("/api/trainers/get-trainers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        cashedTrainers = data.value;
        return cashedTrainers;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  }

  async function getTrainerById(id: number) {
    try {
      const trainer = cashedTrainers.find((trainer: Trainer) => trainer.id === id);
  
      if (trainer) {
        return trainer;
      } else {
        throw new Error(`Тренер с идентификатором ${id} не найден`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }
  

  async function createTrainer(trainer: Trainer) {
    try {
      if (trainer.name === "") {
        toast.warning("Имя тренера не должно быть пустым");
      } else {
        let data = await useFetch("/api/trainers/create-trainer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trainer }),
        });
        cashedTrainers = null;
        if (data.data.value === undefined) {
          toast.success("Тренер успешно добавлен");
        } else {
          toast.error("Произошла ошибка при добавлении тренера");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function updateTrainer(trainer: Trainer) {
    try {
      let data = await useFetch("/api/trainers/edit-trainer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trainer }),
      });
      cashedTrainers = null;
      toast.success("Тренер успешно обновлен!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function deleteTrainer(id: number) {
    try {
      let data = await useFetch("/api/trainers/delete-trainer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      cashedTrainers = null;
      toast.success("Тренер успешно удален!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  function filterSchedulesByDate(schedules: Schedule[]) {
    const currentDate = new Date();
    return schedules.filter((schedule) => new Date(schedule.dateTime) > currentDate);
  }
  
  function filterPastSchedules(schedules: Schedule[]) {
    const currentDate = new Date();
    return schedules.filter(schedule => new Date(schedule.dateTime) < currentDate);
  }

  return {
    getTrainers,
    createTrainer,
    updateTrainer,
    deleteTrainer,
    getTrainerById,
    filterSchedulesByDate,
    filterPastSchedules
  };
});
