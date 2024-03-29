import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { filter, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id:           new FormControl<string>(''),   
    superhero:     new FormControl<string>('', {nonNullable: true}),  
    publisher:      new FormControl<Publisher>(Publisher.DCComics), 
    alter_ego:      new FormControl(''), 
    first_appearance:new FormControl(''),
    characters:  new FormControl(''),    
    alt_img:     new FormControl(''),   
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ]

  constructor(private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ){}

  ngOnInit(): void {
    if(!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.heroesService.getHeroById(id)),
      ).subscribe(hero => {
        
        if(!hero) return this.router.navigateByUrl('/');

        this.heroForm.reset(hero);
        return;
      })
  }

  get currentHero():Hero{
    const hero = this.heroForm.value as Hero;

    return hero;
  }

  onSubmit(){
    if(this.heroForm.invalid) return;

    if(this.currentHero.id){
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.shwoSnackbar(`${hero.superhero} updated!`);
        });
      return;
    }
    this.heroesService.addHero(this.currentHero)
      .subscribe( hero => {
        this.router.navigate(['/heroes/edit', hero.id]);
        this.shwoSnackbar(`${hero.superhero} created!`);
      })
    // this.heroesService.updateHero(this.heroForm.value);
  }

  onDeleteHero(){
    if(!this.currentHero.id) throw new Error('Hero Id Is Required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed()
      .pipe(
        filter( (res: boolean) => res ),
        switchMap( () => this.heroesService.deleteHeroById( this.currentHero.id ) ),
        filter( (wasDeteled: boolean) => wasDeteled ),
      ).subscribe( () => {
        this.router.navigate(['/heroes']);
    })

    // dialogRef.afterClosed().subscribe(result => {
    //   if(!result) return;
    //   this.heroesService.deleteHeroById(this.currentHero.id)
    //     .subscribe(wasDeteled => {
    //       if(wasDeteled)
    //       this.router.navigate(['/heroes']);
    //     })
    // });
  }

  shwoSnackbar(message:string):void{
    this.snackbar.open(message, 'Done', {
      duration: 1700
    })
  }
}
