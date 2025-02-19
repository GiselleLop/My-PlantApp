import { auth, editUserProfile, getUserData } from "../../../../firebase";
import "./EditProfileModal.css"
import Notiflix from "notiflix"; 

export async function renderEditProfileModal() {
    const userId = auth.currentUser;
    const userData = await getUserData(userId.uid)
    const mainModal = document.createElement('div');
    mainModal.classList.add("mainModal");
    mainModal.innerHTML = `    
    <div class='modal_content_profile'>
        <div class="header_modal_profile">
            <h4 class='editProfileTitle'>Edit profile</h4>
            <button class='cancel_button'>X</button>
        </div>
  
        <form class="profile_edit_form">
            <div class="input_edit_1">
                <label for="profileUserName">Username:</label>
                <input type="text" id="profileUserName" placeholder="Username" class="input_username_edit" value="${userData?.username?.split(' ')[0]}">
            </div>
            <div class="input_edit_1">
                <label for="profileImageEdit">Change profile photo:</label>
                <input type="file" id="profileImageEdit" accept="image/*">
            </div>
            <div class="container_modal_buttons_profile">
                <button class="saveEditPButton">Save</button>
                <button class="cancelEditPButton">Cancel</button>
            </div>
        </form>
    </div>
   `;
    document.body.appendChild(mainModal);

    const closeModalButton = document.querySelector(".cancel_button");
    const cancelModalButton = document.querySelector(".cancelEditPButton");
    const saveButton = document.querySelector('.saveEditPButton');
    const regex = /^[a-zA-Z0-9]+$/;

    closeModalButton.addEventListener("click", () => {
      mainModal.remove();
    });
    cancelModalButton.addEventListener("click", () => {
      mainModal.remove();
    });
    saveButton.addEventListener('click', (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('profileImageEdit');
        const file = fileInput.files[0] ? fileInput.files[0] : null;
        const nameuser = document.querySelector('#profileUserName');

        if (nameuser.value === '') {
            nameuser.classList.add('fadeOut');
            setTimeout(() => {
                nameuser.classList.remove('fadeOut');
            }, 1000);
            return;
        }
        if (!regex.test(nameuser.value)) {
            Notiflix.Notify.failure("Please only enter letters and numbers without spaces.")
            return 
        }
        editUserProfile(nameuser.value, file)
        .then(() => {
            mainModal.remove();
            Notiflix.Notify.success("¡Guardado correctamente!"); 
        })
        .catch((err) => {
            console.log(err);
            
            Notiflix.Notify.failure("Ocurrió un error, inténtelo de nuevo más tarde")
        })
    });
    mainModal.addEventListener("click", (event) => {
        if (!event.target.closest(".modal_content_profile")) {
            mainModal.remove();
        }
    });

    return mainModal;
}
    