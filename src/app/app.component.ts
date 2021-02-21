import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { StripeService } from './stripe.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'angular-stripe';
  @ViewChild('cardInfo') cardInfo: ElementRef;
  cardError: string;
  card: any;
  previsualizacion: string;
  constructor(
    private ngZone: NgZone,
    private stripeService: StripeService,
    private satinizer: DomSanitizer
  ) {}
  ngAfterViewInit(): void {
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.onChange.bind(this));
  }
  onChange({ error }) {
    if (error) {
      this.ngZone.run(() => {
        this.cardError = error.message;
      });
    } else {
      this.ngZone.run(() => {
        this.cardError = null;
      });
    }
  }
  public archivos: any = [];
  async onClick() {
    const { token, error } = await stripe.createToken(this.card);

    if (token) {
      console.log(token);
      const response = await this.stripeService.charge(100, token.id);
      console.log(response);
    } else {
      this.ngZone.run(() => {
        this.cardError = error.message;
      });
    }
  }

  captureFile(event) {
    console.log(event);
    const fileCapture = event.target.files[0];
    this.extraerBase64(fileCapture).then((imagen: any) => {
      console.log(imagen);
      this.previsualizacion = imagen.base;
    });
    this.archivos.push(fileCapture);
  }

  extraerBase64 = async ($event: any) =>
    new Promise((resolve, reject) => {
      try {
        const unsafeImg = window.URL.createObjectURL($event);
        const image = this.satinizer.bypassSecurityTrustUrl(unsafeImg);
        const reader = new FileReader();
        reader.readAsDataURL($event);
        reader.onload = () => {
          resolve({
            blob: $event,
            image,
            base: reader.result,
          });
        };
        reader.onerror = (error) => {
          resolve({
            base: null,
          });
        };
      } catch (error) {
        return null;
      }
    });

  subirArchivo() {
    try {
      const formulario = new FormData();
      this.archivos.forEach((archivo) => {
        formulario.append('files', archivo);
      });
      console.log(this.archivos);
      // Enviar al servidor
    } catch (error) {}
  }
}
