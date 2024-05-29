import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useCertificationsStore = defineStore("certifications", () => {
  let cashedCertification: any = null;

  async function getCertifications() {
    if (cashedCertification) {
      return cashedCertification;
    } else {
      try {
        let { data }: any = await useFetch("/api/certifications/get-certifications", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        cashedCertification = data.value;
        return cashedCertification;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  }

  async function createCertification(certification: Certification) {
    try {
      if (certification.name === "") {
        toast.warning("Название сертификации не должно быть пустым");
      } else {
        let data = await useFetch("/api/certifications/create-certification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ certification }),
        });
        cashedCertification = null;
        if (data.data.value === undefined) {
          toast.success("Сертификация успешно добавлена");
        } else {
          toast.error("Произошла ошибка при добавлении сертификации");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function updateCertification(certification: Certification) {
    try {
      let data = await useFetch("/api/certifications/edit-certification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ certification }),
      });
      cashedCertification = null;
      toast.success("Сертификация успешно обновлена!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function deleteCertification(id: number) {
    try {
      let data = await useFetch("/api/certifications/delete-certification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      cashedCertification = null;
      toast.success("Сертификация успешно удалена!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return { getCertifications, createCertification, updateCertification, deleteCertification };
});
