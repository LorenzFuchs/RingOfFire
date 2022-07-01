import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collectionData, collection, setDoc, doc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game;
  games$: Observable<any>;
  games = '';




  constructor(private route: ActivatedRoute, private firestore: Firestore, public dialog: MatDialog) {
    this.route.params.subscribe((params) => {
      console.log(params['id']);
      const coll = collection(firestore, 'games');
      this.games$ = collectionData(coll);

      this.games$.subscribe((game) => {
        console.log(game);
        this.games = game;
      })
    });



  }



  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    //const coll = collection(this.firestore, 'games');
    //setDoc(doc(coll), {game: this.game.toJson()});
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();                                 //die pop()-Funktion nimmt den letzten Wert im Array und entfernt diesen
      console.log(this.currentCard);
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;     //um wieder von vorne anzufangen, wenn alle Spieler an der Reihe waren
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}
