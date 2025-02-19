import "./ModalConfirm.css"
import Notiflix from "notiflix"; 

export async function renderModalConfirm(postId, title, description, handleConfirm) {
  const mainModal = document.createElement('div');
  mainModal.classList.add("mainModalConfirm");
  mainModal.innerHTML = `
   <div class='container_main_modal'>
      <div class="header_modal_confirm">
         <h4 class='modal_title'>${title}</h4>
         <button class='cancel_button'>X</button>
      </div>
      <div class="body_modal_confirm">
        <p>${description}</p>
      </div>
      <div class="container_modal_buttons_confirm">
         <button class="saveModalButton">Yes, continue</button>
         <button class="cancelModalButton">Cancel</button>
      </div>
   </div>
   `;

  document.body.appendChild(mainModal);

  const closeModalButton = document.querySelector(".cancel_button");
  const cancelModalButton = document.querySelector(".cancelModalButton");
  const saveModalButton = document.querySelector(".saveModalButton");

  if (closeModalButton, cancelModalButton, saveModalButton) {
    closeModalButton.addEventListener("click", () => {
      mainModal.remove();
    });
    cancelModalButton.addEventListener("click", () => {
      mainModal.remove();
    });
    saveModalButton.addEventListener("click", () => {
        handleConfirm(postId)
        .then(() => {
          mainModal.remove();
          Notiflix.Notify.success("Operation performed correctly!");
        })
        .catch(() => {
          Notiflix.Notify.success("An error occurred, please try again later")
        })
      
    });
  }

  mainModal.addEventListener("click", (event) => {
    if (!event.target.closest(".container_main_modal")) {
      mainModal.remove();
    }
  });

  return mainModal;
}