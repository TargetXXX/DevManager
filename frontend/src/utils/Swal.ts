import Swal from "sweetalert2";

export function confirmDelete(text: string) {
  return Swal.fire({
    title: "Tem certeza?",
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, excluir",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#f50c23ff",
  });
}
