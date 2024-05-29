import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();

export const usePlansStore = defineStore("plans", () => {
  let cashedPlans: any = null;

  async function getPlans() {
    if (cashedPlans) {
      return cashedPlans;
    } else {
      try {
        let { data }: any = await useFetch("/api/plans/get-plans", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        cashedPlans = data.value;
        return cashedPlans;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  }

  async function createPlan(plan: Plan) {
    try {
      let data = await useFetch("/api/plans/create-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });
      cashedPlans = null;
      if (data.data.value === undefined) {
        toast.success("Тарифный план успешно добавлена");
      } else {
        toast.error("Произошла ошибка при добавлении тарифного плана");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function updatePlan(plan: Plan) {
    try {
      let data = await useFetch("/api/plans/edit-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });
      cashedPlans = null;
      toast.success("Тарифный успешно обновлен!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function deletePlan(id: number) {
    try {
      let data = await useFetch("/api/plans/delete-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      cashedPlans = null;
      toast.success("Тарифный план успешно удален!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return {
    getPlans,
    createPlan,
    updatePlan,
    deletePlan,
  };
});
