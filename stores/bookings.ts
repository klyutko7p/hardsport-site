import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useBookingsStore = defineStore("bookings", () => {
  let cashedBookings: any = null;
  let cashedOnlineBookings: any = null;
  let cashedServices: any = null;

  async function getOnlineBookings() {
    if (cashedOnlineBookings) {
      return cashedOnlineBookings;
    } else {
      try {
        let { data }: any = await useFetch("/api/bookings/get-online-bookings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        cashedOnlineBookings = data.value;
        return cashedOnlineBookings;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  }

  async function createOnlineBooking(booking: OnlineBooking) {
    try {
      let data = await useFetch("/api/bookings/create-online-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ booking }),
      });
      cashedOnlineBookings = null;
      if (data.data.value === undefined) {
        toast.success("Услуга успешно добавлена");
      } else {
        toast.error("Произошла ошибка при добавлении услуги");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function updateOnlineBooking(booking: OnlineBooking) {
    try {
      let data = await useFetch("/api/bookings/edit-online-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ booking }),
      });
      cashedOnlineBookings = null;
      toast.success("Услуга успешно обновлена!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function deleteOnlineBooking(id: number) {
    try {
      let data = await useFetch("/api/bookings/delete-online-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      cashedOnlineBookings = null;
      toast.success("Услуга успешно удалена!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function getServices() {
    if (cashedServices) {
      return cashedServices;
    } else {
      try {
        let { data }: any = await useFetch("/api/services/get-services", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        cashedServices = data.value;
        return cashedServices;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  }

  async function createService(service: Service) {
    try {
      let data = await useFetch("/api/services/create-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ service }),
      });
      cashedServices = null;
      if (data.data.value === undefined) {
        toast.success("Сервис успешно добавлен!");
      } else {
        toast.error("Произошла ошибка при добавлении сервиса");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function updateService(service: Service) {
    try {
      let data = await useFetch("/api/services/edit-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ service }),
      });
      cashedServices = null;
      toast.success("Сервис успешно обновлен!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function deleteService(id: number) {
    try {
      let data = await useFetch("/api/services/delete-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      cashedServices = null;
      toast.success("Сервис успешно удален!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function getBookings() {
    if (cashedBookings) {
      return cashedBookings;
    } else {
      try {
        let { data }: any = await useFetch("/api/bookings/get-bookings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        cashedBookings = data.value;
        return cashedBookings;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  }

  async function createBooking(booking: Booking) {
    try {
      let data = await useFetch("/api/bookings/create-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ booking }),
      });
      cashedBookings = null;
      if (data.data.value === undefined) {
        toast.success("Бронь успешно добавлена");
      } else {
        toast.error("Произошла ошибка при добавлении брони");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function updateBooking(booking: Booking) {
    try {
      let data = await useFetch("/api/bookings/edit-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ booking }),
      });
      cashedBookings = null;
      toast.success("Бронь успешно обновлена!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function deleteBooking(id: number) {
    try {
      let data = await useFetch("/api/bookings/delete-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      cashedBookings = null;
      toast.success("Бронь успешно удалена!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return {
    getBookings,
    getOnlineBookings,
    getServices,
    createBooking,
    createOnlineBooking,
    createService,
    updateOnlineBooking,
    updateBooking,
    updateService,
    deleteOnlineBooking,
    deleteBooking,
    deleteService,
  };
});
