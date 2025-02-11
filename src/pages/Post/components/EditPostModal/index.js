import { editPost } from "../../../../firebase";
import "./EditPostModal.css"
import Notiflix from "notiflix"; 

export async function renderEditPostModal(postData) {
  const mainModal = document.createElement('div');
  mainModal.classList.add("mainModal");
  mainModal.innerHTML = `
   <div class='modal_content'>
      <div class="header_modal">
         <h4 class='editPublic'>Edit post</h4>
         <button class='cancel_button'>X</button>
      </div>
  
      <textarea class="editContentTextarea" placeholder="Enter the content of the publication">${postData.data().description}</textarea>
      <span class="error_message_modal"></span>
      <div class="container_modal_buttons">
         <button class="saveEditButton">Save</button>
         <button class="cancelEditButton">Cancel</button>
      </div>
   </div>
   `;

  document.body.appendChild(mainModal);

  const closeModalButton = document.querySelector(".cancel_button");
  const cancelModalButton = document.querySelector(".cancelEditButton");
  const saveModalButton = document.querySelector(".saveEditButton");
  const textareaModal = document.querySelector(".editContentTextarea");
  const errorModal = document.querySelector(".error_message_modal");
  if (closeModalButton, cancelModalButton, saveModalButton) {
    closeModalButton.addEventListener("click", () => {
      mainModal.remove();
    });
    cancelModalButton.addEventListener("click", () => {
      mainModal.remove();
    });
    saveModalButton.addEventListener("click", () => {
      if(textareaModal.value.trim() === ''){
        errorModal.textContent ="Completa el campo"
      } else {
        editPost(postData.id, textareaModal.value)
        .then(() => {
          mainModal.remove();
          Notiflix.Notify.success("¡Guardado correctamente!");
        })
        .catch(() => {
          errorModal.textContent ="Ocurrió un error, inténtelo de nuevo más tarde"
        })
      }
    });

    textareaModal.addEventListener("input", () => {
      if (errorModal.textContent !== "") {
        errorModal.textContent = "";
      }
    });
  }

  mainModal.addEventListener("click", (event) => {
    if (!event.target.closest(".modal_content")) {
      mainModal.remove();
    }
  });

  return mainModal;
}
    