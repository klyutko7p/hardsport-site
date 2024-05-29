import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useWorkoutStore = defineStore("workout", () => {
  let cashedCategories: any = null;
  let cashedWorkouts: any = null;

  async function getCategories() {
    if (cashedCategories) {
      return cashedCategories;
    } else {
      try {
        let { data }: any = await useFetch("/api/workouts/get-categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        cashedCategories = data.value;
        return cashedCategories;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  }

  async function createCategory(category: WorkoutCategory) {
    try {
      if (category.name === "") {
        toast.warning("Название категории не должно быть пустым");
      } else {
        let data = await useFetch("/api/workouts/create-category", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category }),
        });
        cashedCategories = null;
        if (data.data.value === undefined) {
          toast.success("Категория успешно добавлена");
        } else {
          toast.error("Произошла ошибка при добавлении категории");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function updateCategory(category: WorkoutCategory) {
    try {
      let data = await useFetch("/api/workouts/edit-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      });
      cashedCategories = null;
      toast.success("Категория успешно обновлена!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function deleteCategory(id: number) {
    try {
      let data = await useFetch("/api/workouts/delete-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      cashedCategories = null;
      toast.success("Категория успешно удалена!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function getWorkouts() {
    if (cashedWorkouts) {
      return cashedWorkouts;
    } else {
      try {
        let { data }: any = await useFetch("/api/workouts/get-workouts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        cashedWorkouts = data.value;
        return cashedWorkouts;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  }

  async function createWorkout(workout: Workout) {
    try {
      if (workout.title === "") {
        toast.warning("Название тренировки не должно быть пустым");
      } else {
        let data = await useFetch("/api/workouts/create-workout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ workout }),
        });
        cashedWorkouts = null;
        if (data.data.value === undefined) {
          toast.success("Тренировка успешно добавлена");
        } else {
          toast.error("Произошла ошибка при добавлении тренировки");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function updateWorkout(workout: Workout) {
    try {
      let data = await useFetch("/api/workouts/edit-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workout }),
      });
      cashedWorkouts = null;
      toast.success("Тренировка успешно обновлена!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function deleteWorkout(id: number) {
    try {
      let data = await useFetch("/api/workouts/delete-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      cashedWorkouts = null;
      toast.success("Тренировка успешно удалена!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout,
  };
});
