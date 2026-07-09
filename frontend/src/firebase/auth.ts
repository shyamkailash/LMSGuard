import { getAuth } from "firebase/auth";

import { firebaseApp } from "@/firebase/config";

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
