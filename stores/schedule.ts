import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useScheduleStore = defineStore("schedule", () => {
  let cashedSchedules: any = null;

  async function getSchedules() {
    if (cashedSchedules) {
      return cashedSchedules;
    } else {
      try {
        let { data }: any = await useFetch("/api/schedules/get-schedules", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        cashedSchedules = data.value;
        return cashedSchedules;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  }

  async function createSchedule(schedule: Schedule) {
    try {
      let data = await useFetch("/api/schedules/create-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ schedule }),
      });
      cashedSchedules = null;
      if (data.data.value === undefined) {
        toast.success("Расписание успешно добавлено");
      } else {
        toast.error("Произошла ошибка при добавлении расписания");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function updateSchedule(schedule: Schedule) {
    try {
      let data = await useFetch("/api/schedules/edit-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ schedule }),
      });
      cashedSchedules = null;
      toast.success("Расписание успешно обновлено!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function deleteSchedule(id: number) {
    try {
      let data = await useFetch("/api/schedules/delete-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      cashedSchedules = null;
      toast.success("Расписание успешно удалено!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return {
    getSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
});
