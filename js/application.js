var NotesApp = (function() {

  var App = {
    stores:{},
    views:{}
  }
  App.stores.notes = new Store('notes');

  //note Model
  var Note = Backbone.Model.extend({
    localStorage : App.stores.notes,
    initialize: function(){
      if(!this.get('title')){
        this.set({title: "Note @"+Date()})
      };
      if(!this.get('body')){
        this.set({body: "No content"})
      };
    }
  });

  var NodeList = Backbone.Collection.extend({

  });

  //views
  var newFormView = Backbone.View.extend({
    events: {
      "submit":"createNote"
    },
    createNote: function(e){
      var attr = this.getAttributes(),
          note = new Note();
          console.log(note);


      note.set(attr);
      note.save();

      //stop browser for actually submiting the form
      e.preventDefault();
      //stop jquery mobile to doing this form from magic
      e.stopPropagation();

      //close

      $('.ui-dialog').dialog('close');
      this.reset();
    },

    getAttributes: function(){
      return {
        title: this.$('form [name=title]').val(),
        body: this.$('form [name=body]').val()
      }
    },
    reset: function(){
      //reset the form any input any textarea will be reset 
      this.$('input, textarea').val('');
    }
  });


  window.Note = Note;

  $(document).ready(function(){
    App.views.new_form = new newFormView({
      el: $('#new')
    });
  })
  
  return App;
})()