import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ContatoService } from '../shared/contato.service';
import { ContatoDataService } from '../shared/contato-data.service';
import { Contato } from '../shared/contato';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  contatos: Observable<any>;

  constructor(
    private contatoService: ContatoService,
    private contatoDataService: ContatoDataService,
    private storage: AngularFireStorage
    ) { }

  ngOnInit() {
    this.contatos = this.contatoService.getAll();
  }

  delete(key: string) {
    this.contatoService.delete(key);
  }

  edit(contato: Contato, key: string) {
    this.contatoDataService.changeContato(contato, key);
  }

  print(contato: Contato) {
    const popupWin = window.open('', '_blank', 'width=300,height=300');
    popupWin.document.open();
    // tslint:disable-next-line:max-line-length
    popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + contato.nome + ' ' + contato.telefone + '</body></html>');
    popupWin.document.close();

  }

}
