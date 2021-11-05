import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService, NbWindowControlButtonsConfig, NbWindowService } from '@nebular/theme';
import { NbBooleanInput } from '@nebular/theme/components/helpers';
import { Subject } from 'rxjs';
import * as restrictions from '../../models/restrictions/new-product.restrictions';
@Component({
  selector: 'app-create-new-product',
  templateUrl: './create-new-product.component.html',
  styleUrls: ['./create-new-product.component.scss'],
})
export class CreateNewProductComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();
  @ViewChild('delete', { read: TemplateRef }) deleteTemplate: TemplateRef<HTMLElement>;


  // Emit an event when a file has been picked. Here we return the file itself
	@Output() onChange: EventEmitter<File> = new EventEmitter<File>();
	@Input() isEnabled = true;



	// If the input has changed(file picked) we project the file into the img previewer
	updateSource($event: Event) {
		// We access he file with $event.target['files'][0]
   
	
    const reader = new FileReader();
		reader.onload = (e: any) => {
			// Simply set e.target.result as our <img> src in the layout
		this.source = e.target.result;
		//this.onChange.emit($event.target['files'][0]);
		};
		// This will process our file and get it's attributes/data
		reader.readAsDataURL($event.target['files'][0]);
   this.imagesCont=+1;
	}
  //  <img [src]="source" width="200" height="200" />

	// Uses FileReader to read the file from the input
	@Input() source: string = '';
	projectImage(file: File) {
		const reader = new FileReader();
		reader.onload = (e: any) => {
			// Simply set e.target.result as our <img> src in the layout
			this.source = e.target.result;
		this.onChange.emit(file);
		};
		// This will process our file and get it's attributes/data
		reader.readAsDataURL(file);
   
	}

  titleMaxLength: number;
  titleIsRequired!: boolean;
  descriptionMaxLength!: number;
  descriptionIsRequired!: boolean;
  imageDescriptionMaxLength!: number;
  priceIsRequired!: boolean;
  imageMaxLength!: number;
  imageIsRequired!: boolean;
  amountIsRequired!: boolean;
  createLoadingSpinner!: boolean;
  productForm!: FormGroup;
  lastImagePicked!: FileList;
  actualImg: any;
  imagesCont: number;
  minimize: boolean;
  maximize: boolean;
  fullScreen: boolean;

  constructor(
    private fb: FormBuilder,
    private toastr: NbToastrService,
    private windowService: NbWindowService,
    private router: Router,
    ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    this.initializeVariables();
    this.initializeForms();
  }
  categories = [
    
      'Videojuegos',
     'Vestuario',
     'Electronica',
     'Vehiculos'
    
  ]


  private initializeVariables() {
    this.titleMaxLength = restrictions.titleMaxLength;
    this.titleIsRequired = restrictions.titleIsRequired;
    this.descriptionMaxLength = restrictions.descriptionMaxLength;
    this.descriptionIsRequired = restrictions.descriptionIsRequired;
    this.priceIsRequired = restrictions.priceIsRequired;
    this.imageMaxLength = restrictions.imageMaxLength;
    this.imageIsRequired = restrictions.imageIsRequired;
    this.amountIsRequired = restrictions.amountIsRequired;
    this.imageDescriptionMaxLength = restrictions.imageDescriptionLength;
    this.createLoadingSpinner = false;
    this.imagesCont = 0;
    this.fullScreen = false;
    this.minimize = false;
    this.maximize = false;
  }

  private initializeForms() {
    this.productForm = this.fb.group({
      title: this.fb.control('', [
        Validators.required,
        Validators.maxLength(this.titleMaxLength),
      ]),
      description: this.fb.control('', [
        Validators.required,
        Validators.maxLength(this.descriptionMaxLength),
      ]),
      amount: this.fb.control('', Validators.required),
      price: this.fb.control('', Validators.required),
      categories: this.fb.control([], [Validators.required, Validators.minLength(1)]),
      images: this.fb.array([]),
      isActive: this.fb.control(false, Validators.required),
    });
  }
  openWindowDelete() {
    const buttonsConfig: NbWindowControlButtonsConfig = {
      minimize: this.minimize,
      maximize: this.maximize,
      fullScreen: this.fullScreen,
    }
    this.windowService.open(
      this.deleteTemplate,
      { title: 'Eliminar imagen', hasBackdrop: true, buttons: buttonsConfig },
    );
  }

  imageChange(image) {
		this.actualImg = image;
	}
  //<img-picker (onChange)="imageChange($event)"></img-picker>
  get imagesArray(): FormArray {
		return this.productForm.get('images') as FormArray;
	}
  createImageItem(data: any): FormGroup {
		return this.fb.group(data);
	}
  detectFiles(event: any) {
		let images: FileList = event.target.files;
		this.lastImagePicked = images;

		if (images) {
			if (images.length > this.imageMaxLength) {
        console.log('No puede subir más de 5 imagenes')
			//	this.toastr.showErrorToast();
			} else {
				for (let index = 0; index < images.length; index++) {
					const file = images[index];
					let reader = new FileReader();
					if (file.size < 5 * 1024 * 1024) {
						reader.onload = (e: any) => {
							this.imagesArray.push(
								this.createImageItem({
                  file,
									name: file.name,
                  description: this.fb.control('', Validators.required),
								}),
							);
						};
						reader.readAsDataURL(file);
					} else {
					//	this.toastr.showErrorToast();
					}
				}
			}
		}
	}
	removeFile(i: any) {
		this.imagesArray.removeAt(i);
   
	}
  get form() {
    return this.productForm.controls;
  }

  loading = false;
  goToList(){
    
    this.loading = true;
    setTimeout(() => this.loading = false, 2000);
    setTimeout(() =>  this.router.navigateByUrl(``), 2000);
    
  }

  submit() {
		let newProduct = this.productForm.value;
		const formData = new FormData();

		formData.set('title', newProduct.title);
		formData.set('description', newProduct.description);
		formData.set('price', newProduct.price);
		formData.set('amount', newProduct.amount);
		formData.set('type', newProduct.type);
		formData.set('images', newProduct.images);

		this.createLoadingSpinner = true;
	
	}
}