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
  
      <textarea class="editContentTextarea" placeholder="Enter the content of the publication">${postData.description}</textarea>
    
      <div class="container_modal_buttons">
         <button class="saveEditButton">
            <p class="save_text_b_EP">Save<p>
            <div id="loading-spinnerEP" class="spinner hidden"></div>
         </button>
         
         <button class="cancelEditButton">
            <p class="cance_text_b_EP">Cancel</p>
         </button>
      </div>
   </div>
   `;

  document.body.appendChild(mainModal);

  const closeModalButton = document.querySelector(".cancel_button");
  const cancelModalButton = document.querySelector(".cancelEditButton");
  const saveModalButton = document.querySelector(".saveEditButton");
  const textareaModal = document.querySelector(".editContentTextarea");
 
  if (closeModalButton, cancelModalButton, saveModalButton) {
    closeModalButton.addEventListener("click", () => {
      mainModal.remove();
    });
    cancelModalButton.addEventListener("click", () => {
      mainModal.remove();
    });
    saveModalButton.addEventListener("click", () => {
      if (textareaModal.value.trim() === '') {
        textareaModal.classList.add('fadeOut');
        setTimeout(() => {
          textareaModal.classList.remove('fadeOut');
        }, 1000);
        return;
      } else {

        document.querySelector(".save_text_b_EP").style.display = "none";
        saveModalButton.disabled = true;
        saveModalButton.style.opacity = "0.5";

        cancelModalButton.disabled = true
        cancelModalButton.style.opacity = "0.5";
        
        document.getElementById("loading-spinnerEP").classList.remove("hidden");

        editPost(postData.id, textareaModal.value)
        .then(() => {
          mainModal.remove();
          Notiflix.Notify.success("¡Guardado correctamente!");
        })
        .catch(() => {
          saveModalButton.disabled = false;
          saveModalButton.style.opacity = "1";

          cancelModalButton.disabled = false
          cancelModalButton.style.opacity = "1";
          Notiflix.Notify.failure("Ocurrió un error, inténtelo de nuevo más tarde")
        })
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
    