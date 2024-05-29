import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useSubscriptionsStore = defineStore("subscriptions", () => {
  let cashedSubscription: any = null;

  async function getSubscriptions() {
    if (cashedSubscription) {
      return cashedSubscription;
    } else {
      try {
        let { data }: any = await useFetch("/api/subscriptions/get-subscriptions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        cashedSubscription = data.value;
        return cashedSubscription;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  }

  async function createSubscription(subscription: Subscription) {
    try {
      let data = await useFetch("/api/subscriptions/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription }),
      });
      cashedSubscription = null;
      if (data.data.value === undefined) {
        toast.success("Абонемент успешно добавлен");
      } else {
        toast.error("Произошла ошибка при добавлении абонемента");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function updateSubscription(subscription: Subscription) {
    try {
      let data = await useFetch("/api/subscriptions/edit-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription }),
      });
      cashedSubscription = null;
      toast.success("Абонемент успешно обновлен!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function deleteSubscription(id: number) {
    try {
      let data = await useFetch("/api/subscriptions/delete-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      cashedSubscription = null;
      toast.success("Абонемент успешно удален!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return {
    getSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  };
});
