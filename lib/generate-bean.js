'use babel';

import GenerateBeanView from './generate-bean-view';
import { CompositeDisposable } from 'atom';

export default {

  generateBeanView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.generateBeanView = new GenerateBeanView(state.generateBeanViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.generateBeanView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'generate-bean:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.generateBeanView.destroy();
  },

  serialize() {
    return {
      generateBeanViewState: this.generateBeanView.serialize()
    };
  },

  toggle() {
    let editor = atom.workspace.getActiveTextEditor();
    let selected_data = editor.getSelectedText();
    let final_bean = selected_data + '\n';
    let arr = selected_data.split('\n');
    for(index in arr){
      let str = arr[index];
      if (str.length == 0) {
        continue;
      }
      let inner_arr = str.split(' ');
      let dec = inner_arr[inner_arr.length - 2];
      let name = inner_arr[inner_arr.length - 1].split(';')[0];
      let f_name = '';
      let str_arr = name.split('');
      for (index in str_arr) {
          if(index == 0){
            f_name += str_arr[index].toUpperCase();
          } else {
            f_name += str_arr[index];
          }
      }
      let setter = 'public void set' + f_name + '('+ dec +' '+ name +'){\n this.'+ name +' = '+name+';\n}\n';
      let getter = 'public '+ dec + ' get' + f_name + '(){\n return '+name+';\n}\n';
      final_bean = final_bean + setter + getter;
    }
    editor.insertText(final_bean);
  },
};
