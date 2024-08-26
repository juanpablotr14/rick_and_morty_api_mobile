import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PersonajeModalComponent } from 'src/app/components/personaje-modal/personaje-modal.component';
import { CharactersServiceService } from 'src/app/services/characters-service.service';
import { FavoritesServiceService } from 'src/app/services/favorites-service.service';

@Component({
  selector: 'app-pagina1',
  templateUrl: './pagina1.page.html',
  styleUrls: ['./pagina1.page.scss'],
})
export class Pagina1Page implements OnInit {

  searchTerm: string = '';
  characters: any[] = [];
  toastMessage: string = '';
  isToastOpen: boolean = false;

  constructor( 
    private charcaterService: CharactersServiceService,
    private modalController: ModalController,
    private favoritesService: FavoritesServiceService
   ) {}

  ngOnInit() {
  }

  onSearch() {
    if (this.searchTerm.trim().length === 0) {
      this.characters = [];
      return;
    }
    
    this.charcaterService.searchCharacters(this.searchTerm).subscribe(
      (data: any) => {
        this.characters = data.results;
      },
      (error) => {
        console.error('Error fetching characters:', error);
        this.toastMessage = `Error fetching characters: '${error.error.error}'`;
        this.characters = [];
      }
    );
  }

  async openCharacterModal(character: any) {
    const modal = await this.modalController.create({
      component: PersonajeModalComponent,
      componentProps: {
        character: character
      }
    });
    return await modal.present();
  }

  isFavorite(character: any): boolean {
    return this.favoritesService.isFavorite(character);
  }

  toggleFavorite(character: any) {

    if (this.isFavorite(character)) {
      this.favoritesService.removeFavorite(character);
      this.toastMessage = `${character.name} removed from favorites`;
    } else {
      this.favoritesService.addFavorite(character);
      this.toastMessage = `${character.name} added to favorites`;
    }

    this.isToastOpen = true;

    setTimeout(() => {
      this.isToastOpen = false;
    }, 3000);

  }

}
