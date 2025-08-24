import { Component, Inject } from '@angular/core';

// Imports NECESARIOS de Angular Material para diálogos
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

// Esta interfaz define la "forma" de los datos que el diálogo espera recibir
export interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  // ¡Importante! Añadir los módulos de Material aquí
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'] // Corregido a styleUrls (plural)
})
export class ConfirmDialogComponent {

  // El constructor inyecta las herramientas para manejar el diálogo
  constructor(
    // dialogRef es una referencia al propio diálogo, para poder cerrarlo
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    // data contiene la información (título y mensaje) que le pasamos al abrirlo
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  // Este método se llama cuando el usuario hace clic en "Cancelar"
  onNoClick(): void {
    this.dialogRef.close(); // Cierra el diálogo sin devolver ningún valor
  }
}
