import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useLessonsStore = defineStore("lessons", () => {
  let cashedCategories: any = null;
  let cashedLessons: any = null;

  async function getCategories() {
    if (cashedCategories) {
      return cashedCategories;
    } else {
      try {
        let { data }: any = await useFetch(
          "/api/lessons-category/get-categories",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        cashedCategories = data.value;
        return cashedCategories;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  }

  async function createCategory(category: LessonCategory) {
    try {
      if (category.categoryName === "") {
        toast.warning("Название категории не должно быть пустым");
      } else {
        let data = await useFetch("/api/lessons-category/create-category", {
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

  async function updateCategory(category: LessonCategory) {
    try {
      let data = await useFetch("/api/lessons-category/edit-category", {
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
      let data = await useFetch("/api/lessons-category/delete-category", {
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

  async function getLessons() {
    if (cashedLessons) {
      return cashedLessons;
    } else {
      try {
        let { data }: any = await useFetch("/api/lessons/get-lessons", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        cashedLessons = data.value;
        return cashedLessons;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  }

  async function getLessonsByCategory(id: number) {
    try {
      let { data }: any = await useFetch(
        "/api/lessons/get-lessons-by-category",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
      return data.value;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function createLesson(lesson: Lesson) {
    try {
      if (lesson.title === "") {
        toast.warning("Название урока не должно быть пустым");
      } else {
        let data = await useFetch("/api/lessons/create-lesson", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lesson }),
        });
        cashedLessons = null;
        if (data.data.value === undefined) {
          toast.success("Урок успешно добавлен");
        } else {
          toast.error("Произошла ошибка при добавлении урока");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function updateLesson(lesson: Lesson) {
    try {
      let data = await useFetch("/api/lessons/edit-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lesson }),
      });
      cashedLessons = null;
      toast.success("Урок успешно обновлен!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function deleteLesson(id: number) {
    try {
      let data = await useFetch("/api/lessons/delete-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      cashedLessons = null;
      toast.success("Урок успешно удален!");
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
    getLessons,
    createLesson,
    updateLesson,
    deleteLesson,
    getLessonsByCategory,
  };
});
