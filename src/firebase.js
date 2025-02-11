import {
  deleteDoc,
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  arrayUnion, 
  serverTimestamp 
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  
} from 'firebase/auth';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  getStorage,
} from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import navigateTo from './main';

dayjs.extend(relativeTime);

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
const storage = getStorage(app);

export {
  app, firestore, googleProvider, auth, db
};

// Para crear o registrar usuarios
export function createUser(email, password, username) {
  return new Promise((resolve, reject) => {
    // Validar si el username está vacío
    if (!username || username.trim() === "") {
      reject("auth/invalid-username");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setDoc(doc(db, "user", user.uid), {
          username: username.trim(), // Elimina espacios en blanco
          email: email,
          createdAt: new Date(),
          profile_image: null
        });
        resolve({ message: "success", email: user.email });
      })
      .catch((error) => {
        console.log(error);
        
        reject(error);
      });
  });
}

// Para iniciar sesion o ingresar
export function login(email, password) {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        const user = userCredential.user;
        resolve({ message: 'success', email: user.email });
      })
      .catch((error) => {
        console.log(error);
        
        reject(error);
      });
  });
}

export async function saveTask(userId, description, imageFile) {
  const postCollection = collection(firestore, 'post');
  const postCreated = {
    userId,
    description,
    likes: 0,
    likedBy: [],
    comments: [],
    created_at: new Date()
  };

  if (!imageFile) {
    await addDoc(postCollection, postCreated);
  } else {
    const imageUrl = await uploadImage(imageFile);
    postCreated.image = imageUrl;
    await addDoc(postCollection, postCreated);
  }
}

// funcion para registro con google
export async function  GoogleRegister(navigateTo) {
   await signInWithPopup(auth, new GoogleAuthProvider())
    .then((result) => {
      const user = result.user;
      setDoc(doc(db, "user", user.uid), {
        username: user.displayName, // Nombre desde la cuenta de Google
        email: user.email,
        createdAt: new Date(),
        profile_image: user.photoURL
      });
  
      navigateTo('/posts');
    })
    .catch((err) => {
      console.log(err);
      
      navigateTo('/');
    });
}

// delete post
export function deletePost(postId) {
  return new Promise((resolve, reject) => {
  const postCollection = collection(firestore, 'post');
  const postDocRef = doc(postCollection, postId);
  deleteDoc(postDocRef)
  .then(() => {
    resolve();
  })
  .catch(() => {
    reject();
  });
});
}

// edit post
export function editPost(postId, updatedDescription) {
  return new Promise((resolve, reject) => {
    const postRef = doc(firestore, 'post', postId);
    updateDoc(postRef, {
      description: updatedDescription,
    })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
}

// likes
export async function handleLike(postId, userLikedId) {
  const postRef = doc(firestore, 'post', postId);
  const docSnap = await getDoc(postRef);
  if (docSnap.exists()) {
    let postLikesUsers = docSnap.data().likedBy;
    if (postLikesUsers.includes(userLikedId)) {
      postLikesUsers = postLikesUsers.filter((userId) => userId !== userLikedId);
    } else {
      postLikesUsers.push(userLikedId);
    }
    await updateDoc(postRef, {
      likedBy: postLikesUsers,
      likes: postLikesUsers.length,
    });
  }
}

// comment
export async function handleComment(postId, userCommentId, comment) {  
  const postRef = doc(firestore, 'post', postId);
  const docSnap = await getDoc(postRef);
  
  if (!docSnap.exists()) {
    console.error("El post no existe");
    return;
  }
    const newComment = {
      userId: userCommentId,
      comment: comment,
      created_at:  new Date(), 
    };
    await updateDoc(postRef, {
      comments: arrayUnion(newComment),
    });
}

// funcion cerrar sesion
export function logOut() {
  return new Promise((resolve, reject) => {
    signOut(auth)
      .then(() => {
        navigateTo('/');
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function initializeAuth(setupPost) {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userPostsCollection = query(
          collection(firestore, 'post'),
          orderBy("created_at", "desc")  
        );        
        onSnapshot(userPostsCollection, (snapshot) => {
          const newPostList = [];
          snapshot.forEach((post) => {
            newPostList.push(post);
          });
          resolve(setupPost(newPostList));
        });
      } else {
        navigateTo('/');
      }
    });
  });
}

// actualizar perfil
export async function editUserProfile(userName, userPhotoProfile) {
  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
  if (urlPattern.test(userPhotoProfile)) {
    updateProfile(auth.currentUser, {
      displayName: userName,
      photoURL: userPhotoProfile,
    });
    return;
  }
  const fileName = `${Date.now()}_${userPhotoProfile.name}`;
  const storageRef = ref(storage, `/profilePhotos/${fileName}`);
  const imageUrl = await uploadBytes(storageRef, userPhotoProfile)
    .then(() => getDownloadURL(storageRef));
  updateProfile(auth.currentUser, {
    displayName: userName, photoURL: imageUrl,
  });
}

export async function getUserData(userId) {
  try {
    // Obtén el documento del usuario
    const userDocRef = doc(db, "user", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
     return null
    }
  } catch (error) {
    console.error("Error al obtener el documento del usuario:", error);
    return null
  }
    
}

export const getRelativeTime = (createdAt) => {
  if (!createdAt || !createdAt.seconds) return "Fecha inválida";
  const date = new Date(createdAt.seconds * 1000); 
  return dayjs(date).fromNow();
};

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_preset"); 

  try {
    const response = await fetch("https://api.cloudinary.com/v1_1/dn3hbzdmu/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Imagen subida con éxito:", data.secure_url);
    return data.secure_url; 
  } catch (error) {
    console.error("Error al subir la imagen:", error);
  }
}