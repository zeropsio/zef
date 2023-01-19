import { Component, Input } from '@angular/core';
import { Md5 } from 'ts-md5';
import { invertColor } from '../core';

@Component({
  selector: 'zef-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: [ './avatar.component.scss' ]
})
export class AvatarComponent {

  @Input()
  image: string;

  @Input()
  initialWordsCount: number;

  @Input()
  externalImage: string;

  @Input()
  set name(v: string) {
    if (!!v) {

      this.initials = this.initialWordsCount
        ? this._getInitials(v.replace(/ .*/,''))
        : this._getInitials(v);
    }

    this._name = v;
  }
  get name() {
    return this._name;
  }

  @Input()
  extension = 'jpg';

  @Input()
  set size(v) {
    this._size = v;
    this.fontSizeFactor = v / 3;
  }
  get size() {
    return this._size;
  }

  @Input()
  set email(v) {
    this._email = v;
    if (v) {
      this._hash = (<string> Md5.hashStr(v.trim().toLocaleLowerCase()));
      this.gravatarImage = `https://www.gravatar.com/avatar/${this._hash}.${this.extension}?s=${(this.size * 1.5)}&d=identicon`;
    }
  }
  get email() {
    return this._email;
  }

  @Input()
  set backgroundColor(v) {
    this._backgroundColor = v;
    this.textColor = invertColor(v);
  }
  get backgroundColor() {
    return this._backgroundColor;
  }

  @Input()
  borderWidth = 0;

  textColor: string;
  fontSizeFactor: number;
  initials: string;
  gravatarImage: string;
  private _email: string;
  private _hash: string;
  private _size = 40;
  private _name: string;
  private _backgroundColor: string;

  private _getInitials(name: string) {
    return name.replace(/[^a-zA-Z- ]/g, '').match(/\b\w/g).join('');
  }

}
