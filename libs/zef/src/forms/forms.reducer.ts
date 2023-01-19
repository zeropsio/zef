import { Injectable } from '@angular/core';
import {
  createFormGroupState,
  updateGroup,
  formGroupReducer
} from 'ngrx-forms';
import keys from 'lodash-es/keys';
import { ZefFormsManagerService } from './forms-manager.service';
import { addForm } from './forms.action';
import { FormsState } from './forms.model';

const initialState = new FormsState();

@Injectable({ providedIn: 'root' })
export class FormsReducer {
  constructor(private _formsManager: ZefFormsManagerService) { }

  createReducer() {
    return (state = initialState, action: any) => {
      let nstate = { ...state };

      // add new form
      if (action.type === addForm.type) {
        nstate = {
          ...nstate,
          [action.id]: createFormGroupState(
            action.id,
            action.defaultValues
          )
        };
      }

      this._formsManager
        .all()
        .filter((d) => !!nstate[d?.id])
        .forEach(({ id, updateFns }) => {

          // standard update from ngrx-forms action
          const form = formGroupReducer(nstate[id], action);

          if (form !== nstate[id]) {
            nstate = {
              ...nstate,
              [id]: form
            };
          }

          // potential user provided update function
          if (updateFns) {
            const ukeys = keys(nstate[id].value);
            const formUpdate = updateGroup(
              keys(updateFns).reduce((obj, key) => {
                if (typeof updateFns[key] === 'object') {
                  obj[key] = updateGroup(updateFns[key]);
                } else {
                  // fake call to find out whether it's our root wrapper function
                  // or ngrx-forms update function
                  const res = updateFns[key]({});

                  if (typeof res === 'object') {
                    // temp solution to
                    // key: (s, ps) => disable(s)
                    // which returns an array, so it mistakens it for
                    // key: (rs) => ({ foo: (s, ps) => disable(s) })
                    // usecase.. so we are cross checking if not only is the result
                    // object, but also if the object contains keys from updatefns
                    const resKeys = keys(res);
                    if (ukeys.some((itm) => resKeys.includes(itm))) {
                      obj[key] = updateGroup(updateFns[key](nstate[id]));
                    } else {
                      obj[key] = updateFns[key];
                    }
                    obj[key] = updateFns[key];
                  } else {
                    obj[key] = updateFns[key];
                  }
                }

                return obj;
              }, {})
            );

            if (formUpdate !== nstate[id]) {
              nstate = {
                ...nstate,
                [id]: formUpdate(nstate[id])
              };
            }
          }
        });

      // reset
      // TODO: resolve
      // if (action.type === zefResetState.type) {
      //   return nstate.filter((id) => id === '<login page id?>');
      // }

      return nstate;
    };
  }
}
