import { BehaviorSubject } from "rxjs"

export const token$ = new BehaviorSubject(localStorage.getItem("token"))

export function updateToken(newToken) {
    if (!newToken) {
        localStorage.removeItem("token");
    } else {
      localStorage.setItem("token", newToken);
    }
    token$.next(newToken);
}