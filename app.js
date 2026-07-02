import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

let currentUser = null;
let currentChat = null;

// HTML elements
const loginBox = document.getElementById("loginBox");
const chatBox = document.getElementById("chatBox");

const usernameInput = document.getElementById("username");
const enterBtn = document.getElementById("enterBtn");

const friendInput = document.getElementById("friendUsername");
const startChatBtn = document.getElementById("startChat");

const messagesDiv = document.getElementById("messages");

// =======================
// SIGN UP USER
// =======================
enterBtn.addEventListener("click", async () => {
  const email = usernameInput.value + "@chatapp.com";
  const password = "123456"; // simple demo password
  const username = usernameInput.value;

  if (!username) {
    alert("Username enter karo");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    currentUser = userCred.user;

    // save user in Firestore
    await setDoc(doc(db, "users", currentUser.uid), {
      username: username,
      email: email,
      createdAt: serverTimestamp()
    });

    loginBox.style.display = "none";
    chatBox.style.display = "block";

    alert("Account created & login successful");

  } catch (err) {
    alert("Error: " + err.message);
  }
});


// =======================
// AUTO LOGIN CHECK
// =======================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;

    loginBox.style.display = "none";
    chatBox.style.display = "block";
  } else {
    loginBox.style.display = "block";
    chatBox.style.display = "none";
  }
});

// =======================
// START CHAT WITH FRIEND
// =======================
startChatBtn.addEventListener("click", async () => {
  const friendUsername = friendInput.value.trim();

  if (!friendUsername) {
    alert("Friend username enter karo");
    return;
  }

  // find friend user
  const q = query(collection(db, "users"), where("username", "==", friendUsername));
  const querySnap = await getDocs(q);

  if (querySnap.empty) {
    alert("User not found");
    return;
  }

  let friendData;
  querySnap.forEach((docSnap) => {
    friendData = { id: docSnap.id, ...docSnap.data() };
  });

  // create chat id (unique for 2 users)
  const chatId =
    currentUser.uid > friendData.id
      ? currentUser.uid + "_" + friendData.id
      : friendData.id + "_" + currentUser.uid;

  currentChat = chatId;

  alert("Chat started with " + friendData.username);

  loadMessages(chatId);
});


// =======================
// SEND MESSAGE
// =======================
sendBtn.addEventListener("click", async () => {
  const msg = messageInput.value.trim();

  if (!msg || !currentChat) return;

  await addDoc(collection(db, "chats", currentChat, "messages"), {
    text: msg,
    sender: currentUser.uid,
    createdAt: serverTimestamp()
  });

  messageInput.value = "";
});


// =======================
// LOAD MESSAGES (REALTIME)
// =======================
function loadMessages(chatId) {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt")
  );

  onSnapshot(q, (snapshot) => {
    messagesDiv.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      const div = document.createElement("div");
      div.classList.add("message");

      if (data.sender === currentUser.uid) {
        div.classList.add("me");
      } else {
        div.classList.add("friend");
      }

      div.innerText = data.text;

      messagesDiv.appendChild(div);
    });
  });
}

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
