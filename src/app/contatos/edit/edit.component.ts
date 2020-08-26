import { Component, OnInit } from '@angular/core';
import { Contato } from '../shared/contato';
import { ContatoService } from '../shared/contato.service';
import { ContatoDataService } from '../shared/contato-data.service';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';





@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  contato: Contato;
  key = '';

  // Para upload da imagem
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  task: AngularFireUploadTask;
  complete: boolean;
  caminhoImagem: string = '';

  constructor(
    private contatoService: ContatoService,
    private contatoDataService: ContatoDataService,
    private storage: AngularFireStorage
    ) { }

  ngOnInit() {
    this.contato = new Contato();
    this.contatoDataService.currentContato.subscribe(data => {
      if (data.contato && data.key) {
        this.contato = new Contato();
        this.contato.nome = data.contato.nome;
        this.contato.telefone = data.contato.telefone;
        this.contato.caminhoImagem = data.contato.caminhoImagem;
        this.key = data.key;
      }
    });
  }

  onSubmit() {

    this.contato.caminhoImagem = this.caminhoImagem;

    if (this.key) {
      this.contatoService.update(this.contato, this.key);
    } else {
      this.contatoService.insert(this.contato);
    }

    this.contato = new Contato();
  }

  upload(event) {

    this.complete = false;
    const file = event.target.files[0]
    const path = `imagens/${new Date().getTime().toString() + file.name}`;
    const fileRef = this.storage.ref(path.replace(/\s/g, ''));
    this.task = this.storage.upload(path.replace(/\s/g, ''), file);
    this.task.then(up => {
      fileRef.getDownloadURL().subscribe(url => {
        this.complete = true;
        this.caminhoImagem = url;
      });
    });
    this.uploadPercent = this.task.percentageChanges();
  }


}
