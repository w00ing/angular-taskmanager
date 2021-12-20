import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  arrayRemove,
  orderBy,
  query,
  where,
  CollectionReference,
  collectionData,
  writeBatch,
} from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs';
import { Board, Task } from './board.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private afAuth: Auth, private db: Firestore) {}

  /**
   * Creates a new board for the current user
   * @param data
   * @returns
   */
  createBoard(data: Board) {
    const user = this.afAuth.currentUser;
    console.log('USER', user);
    return addDoc(collection(this.db, 'boards'), {
      ...data,
      uid: user?.uid,
      tasks: [{ description: 'Hello!', label: 'yellow' }],
    });
  }

  /**
   * Deletes board
   * @param boardId
   * @returns
   */
  deleteBoard(boardId: string) {
    return deleteDoc(doc(this.db, 'boards', boardId));
  }

  /**
   *
   * Updates the tasks on board
   * @param boardId
   * @param tasks
   * @returns
   */
  updateTasks(boardId: string, tasks: Task[]) {
    return updateDoc(doc(this.db, 'boards', boardId), { tasks });
  }

  /**
   * Removes a specific task from the board
   * @param boardId
   * @param task
   * @returns
   */
  removeTask(boardId: string, task: Task) {
    return updateDoc(doc(this.db, 'boards', boardId), {
      tasks: arrayRemove(task),
    });
  }

  /**
   * Get all boards owned by current user
   * @returns
   */
  getUserBoards() {
    return authState(this.afAuth).pipe(
      switchMap((user) => {
        if (user) {
          return collectionData<Board>(
            query<Board>(
              collection(this.db, 'boards') as CollectionReference<Board>,
              where('uid', '==', user.uid),
              orderBy('priority')
            ),
            { idField: 'id' }
          );
        } else {
          return [];
        }
      })
    );
  }

  /**
   * Run a batch write to change the priority of each board for sorting
   * @param boards
   */
  sortBoards(boards: Board[]) {
    const batch = writeBatch(this.db);
    const refs = boards.map((b) => doc(this.db, 'boards', b.id!));
    refs.forEach((ref, idx) => batch.update(ref, { priority: idx }));
    batch.commit();
  }
}
