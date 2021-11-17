import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_WINDOW, NbMenuService } from '@nebular/theme';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NbThemeService } from '@nebular/theme';
import { HeaderService } from '../../pages/marketplace/services/header.service';
import { ProductsService } from '../../pages/marketplace/services/products.service';
import { InputSearchService } from '../../pages/marketplace/services/inputSearch.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
 
  currentTheme = 'default';
  checked: string;
  search : string;
  constructor(
    private router: Router,
    private nbMenuService: NbMenuService,
    @Inject(NB_WINDOW) private window,
    private themeService: NbThemeService,
    private headerService: HeaderService,
    private productsService : ProductsService,
    private inputSearch : InputSearchService,

  ) {}

  items = [ { title: 'Iniciar Sesión' }, { title: 'Registrarse' }];
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit() {
    this.search = this.inputSearch.search;
    this.currentTheme = this.themeService.currentTheme
    this.checked = this.themeService.currentTheme;
    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'my-context-menu'),
        map(({ item: { title } }) => title)
      )
      .subscribe((title) => {
        if (title == 'Iniciar Sesión') {
          this.router.navigateByUrl(`auth/login`);
        }
        if (title == 'Registrarse') {
          this.router.navigateByUrl(`auth/register`);
        }
      });
    //----
    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe((themeName) => (this.currentTheme = themeName));
  }
  changeTheme(themeName: string) {
    setTimeout(() => this.themeService.changeTheme(themeName), 100);
    this.checked = themeName;
  }


  goToListProduct() {
    this.inputSearch.search = this.search;
    this.inputSearch.input(this.search);
    this.productsService.allCategories()
    this.router.navigateByUrl(`marketplace/list-products`);
    document.getElementById('mode').classList.toggle('show');
  }

  showMenu() {
    document.getElementById('mode').classList.toggle('show');
  }
}
