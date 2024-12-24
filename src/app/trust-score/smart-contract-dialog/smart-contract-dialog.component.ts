import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-smart-contract-dialog',
  templateUrl: './smart-contract-dialog.component.html',
  styleUrls: ['./smart-contract-dialog.component.css']
})
export class SmartContractDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { transactionHash: string },
    public dialogRef: MatDialogRef<SmartContractDialogComponent>
  ) {}
}
