import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }
  /* emailSignUp(credentials: EmailPasswordCredentials): firebase.Promise<FirebaseAuthState> {
    return this.af.auth.createUser(credentials)
      .then(() => console.log("success"))
      .catch(error => console.log(error));
  } */
  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }
  emailSignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        return this.updateUserData(user);
      });
  }
  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      roles: {
        subscriber: true,
      }
    } as User;

    return userRef.set(data, { merge: true });

  }
  async signOut() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }
}
